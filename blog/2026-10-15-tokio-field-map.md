---
title: "Moving from tokio::sync to Asyncband"
description: "A guide to corresponding synchronization APIs and the differences in initialization, notifications, permit accounting, and channel behavior."
authors: [nanami, tison]
tags: [migration, tokio]
---

Asyncband is a collection of asynchronous synchronization primitives. Several have counterparts in `tokio::sync`, with different API choices; others provide additional forms of coordination. For a project already using Tokio, the practical questions are which operations have a corresponding API and which assumptions need to change.

Runtime independence is shared by both libraries. Tokio documents its [synchronization primitives as runtime agnostic](https://docs.rs/tokio/1.53.3/tokio/sync/index.html#runtime-compatibility), with an exception for methods such as `send_timeout` that use its timer. Asyncband can also run on a Tokio executor. The choice of synchronization API does not by itself require a change of runtime.

<!-- truncate -->

_This guide compares Asyncband 0.7.3 with Tokio 1.53.3. Links point to those versions._

## Modules and features

Asyncband has no default features. Enable the primitives your code uses:

```toml
asyncband = { version = "0.7.3", features = ["mutex", "semaphore", "once-cell"] }
```

Types live in their respective modules. For example, `Mutex` is imported from `asyncband::mutex`, while `OnceCell` lives in `asyncband::once` and requires the `once-cell` feature. The `once` feature enables the separate `Once` primitive.

The following table is a starting point for locating APIs. Paths in the second column are relative to `asyncband`.

| Tokio API         | Asyncband API                                                                                       | Check when porting                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `sync::Mutex`     | [`mutex::Mutex`](https://docs.rs/asyncband/0.7.3/asyncband/mutex/struct.Mutex.html)                 | `try_lock` returns `Option`, rather than `Result`.                                                  |
| `sync::RwLock`    | [`rwlock::RwLock`](https://docs.rs/asyncband/0.7.3/asyncband/rwlock/struct.RwLock.html)             | `try_read` and `try_write` return `Option`.                                                         |
| `sync::Semaphore` | [`semaphore::Semaphore`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html) | `acquire(n)` takes a permit count and returns a guard directly.                                     |
| `sync::Notify`    | [`event`](https://docs.rs/asyncband/0.7.3/asyncband/event/index.html)                               | Choose an event by its retained state; there is no direct replacement for every `Notify` operation. |
| `sync::Barrier`   | [`barrier::Barrier`](https://docs.rs/asyncband/0.7.3/asyncband/barrier/struct.Barrier.html)         | The participant count is `u32`, rather than `usize`.                                                |
| `sync::OnceCell`  | [`once::OnceCell`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceCell.html)             | Initialization is retryable; `set` is asynchronous.                                                 |
| `sync::SetOnce`   | Related API: [`completion`](https://docs.rs/asyncband/0.7.3/asyncband/completion/index.html)        | Publishing and observing use separate handles; abandonment is reported.                             |
| `sync::oneshot`   | [`oneshot`](https://docs.rs/asyncband/0.7.3/asyncband/oneshot/index.html)                           | Retain the receive future when selecting repeatedly.                                                |
| `sync::mpsc`      | [`mpsc`](https://docs.rs/asyncband/0.7.3/asyncband/mpsc/index.html)                                 | Constructors are `bounded` and `unbounded`; `recv` returns `Result`.                                |
| `sync::broadcast` | [`broadcast::mpmc`](https://docs.rs/asyncband/0.7.3/asyncband/broadcast/mpmc/index.html)            | Bounded sends wait for slow receivers instead of evicting unread messages.                          |
| `sync::watch`     | [`watch`](https://docs.rs/asyncband/0.7.3/asyncband/watch/index.html)                               | Values are read by cloning, rather than through a borrow guard.                                     |

Both libraries use guards to release locks and semaphore permits. Their queued lock and semaphore acquisitions preserve queue order; cancelling an acquisition gives up its place without leaking permits. This does not undo changes made by application code while holding a guard. Both barriers are reusable and designate one leader per generation, but `wait` is not cancel-safe: if another branch wins and you still intend to wait, retain the same pending future instead of registering another arrival.

## Initialization and externally supplied values

Both libraries provide `OnceCell::get_or_init` and `get_or_try_init`. A failed, panicked, or cancelled initialization attempt leaves the cell available for another attempt. There are still call-site differences. Tokio's [`OnceCell::set`](https://docs.rs/tokio/1.53.3/tokio/sync/struct.OnceCell.html#method.set) is synchronous and can report that initialization is already in progress. Asyncband's [`set`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceCell.html#method.set) is awaited: it waits for an ongoing attempt, then either stores the supplied value or returns it if the cell has already been initialized.

Tokio also provides [`SetOnce`](https://docs.rs/tokio/1.53.3/tokio/sync/struct.SetOnce.html). One caller supplies a value with `set`, and other callers can `wait` for it without supplying an initializer. Asyncband's `OnceCell` does not have that waiting API. Its [`completion`](https://docs.rs/asyncband/0.7.3/asyncband/completion/index.html) module serves a related use case: a single-use `Completer` publishes a value to cloneable `Completion` observers. Observers receive an `Abandoned` error if the completer is dropped without publishing. That separation of capabilities and the abandonment result are part of the migration decision; it is not a type rename.

## Notifications and shutdown

Tokio's [`Notify`](https://docs.rs/tokio/1.53.3/tokio/sync/struct.Notify.html) supports several notification operations. Choose an Asyncband event based on the state that the application needs to retain:

* `notify_one()` wakes one waiter or stores one permit for a later waiter. `AutoResetEvent::set()` has the corresponding one-signal behavior. Multiple calls with no waiting consumer coalesce into one stored signal.
* `notify_waiters()` notifies existing `Notified` futures, including those created but not yet polled. It does not retain a notification for futures created afterward.
* `ManualResetEvent::set()` releases current waiters and keeps the event set until `reset()`. Later waits also pass while it remains set. It suits a persistent readiness condition, but a `set()`/`reset()` pair is not a direct replacement for `notify_waiters()`.

For shutdown, retain the shutdown state explicitly. A bare `notify_waiters()` call made before a task creates its wait future cannot tell that task to stop later. Asyncband's [`shutdown`](https://docs.rs/asyncband/0.7.3/asyncband/shutdown/index.html) module combines a persistent request with completion tracking: `request_shutdown()` records the request for current and future observers, and awaiting the coordinator waits for every `ShutdownGuard` to be dropped. Workers still decide how to finish their work and release their guards.

## Semaphore counts and closure

Tokio's `acquire().await` acquires one permit and returns a `Result`. Asyncband spells the operation `acquire(1).await` and returns the guard directly, so remove error handling for acquisition when changing that call. Its non-waiting `try_acquire(n)` returns `Option`.

This difference follows from the absence of a closed state. Tokio's [`Semaphore::close`](https://docs.rs/tokio/1.53.3/tokio/sync/struct.Semaphore.html#method.close) makes pending and future acquisitions fail. Asyncband has no corresponding operation. Code that uses closure to stop admission must keep a separate shutdown signal and select between it and acquisition. An acquisition that can never be satisfied still needs to be rejected or given a deadline by the caller.

Permit counts also differ. Tokio accepts `usize` in `new` and `add_permits`, but `u32` in `acquire_many`; its `MAX_PERMITS` is `usize::MAX >> 3` because the representation reserves bits. Asyncband uses `usize` counts throughout and does not reserve count bits. `acquire(n)` handles both single- and multi-permit requests, and `release(n)` adds capacity.

Both libraries let a permit guard `forget` its permits so that dropping it does not return them. When adjusting capacity without first acquiring a guard, distinguish these operations:

* Tokio's `forget_permits(n)` and Asyncband's [`drain_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.drain_permits) remove up to `n` currently available permits and report the amount removed.
* Asyncband's [`reduce_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.reduce_permits) reduces the logical balance by exactly `n`. It leaves existing guards valid; if too few permits are available, future returns repay the deficit before ordinary queued acquisitions proceed.

For example, reducing a fully occupied eight-slot budget by three eventually leaves five slots. Draining three at that moment removes zero. Forgetting an acquired guard requires obtaining those permits first, which may itself wait.

## Channel behavior

### MPSC constructors and receive results

Tokio's `mpsc::channel(capacity)` becomes Asyncband's `mpsc::bounded(capacity)`, and `unbounded_channel()` becomes `unbounded()`. Both bounded variants apply backpressure when full. Their receive results differ: Tokio uses `Option<T>`, with `None` after the channel drains and closes; Asyncband uses `Result<T, RecvError>`, reporting disconnection after buffered values drain. Update receive loops and their end-of-stream handling along with the imports.

### Broadcast retention

Tokio's [`broadcast`](https://docs.rs/tokio/1.53.3/tokio/sync/broadcast/index.html) lets a producer send without waiting for buffer capacity. When its bounded buffer fills, old values are evicted and affected receivers observe `RecvError::Lagged`.

Asyncband's [`broadcast::mpmc::bounded`](https://docs.rs/asyncband/0.7.3/asyncband/broadcast/mpmc/fn.bounded.html) retains messages until active receivers have read them or dropped their subscriptions. A slow receiver therefore makes `send(value).await` wait once the shared backlog fills. There is no lag error, but one receiver that stops draining can stall every producer. Reading a message releases that receiver's claim on buffer capacity; processing it afterward does not hold the slot.

The send result also changes: Asyncband's bounded `send` returns `()`, rather than Tokio's result containing a receiver count. With no active receivers, an Asyncband broadcast send retains nothing. The [channel design](https://github.com/apache/asyncband/issues/167) and [bounded broadcast discussion](https://github.com/apache/asyncband/issues/213) describe these retention choices. Before porting, decide whether slow consumers should cause missed messages or producer backpressure.

### Watch reads

Both watch channels retain the latest value and may coalesce intermediate updates. Tokio exposes `borrow()` and `borrow_and_update()` guards. Asyncband's `get()` clones the current value without marking it observed; `recv().await` waits for an update, clones the latest value, and marks that version observed together. Use `recv` when the consumer needs the updated value, and consider an `Arc<T>` payload when cloning the underlying value would be expensive.

### Oneshot selection

Both oneshot channels provide a synchronous `send` and let the receiver await one value. Tokio's receiver implements `Future`, so it can be borrowed as `&mut receiver` in a `select!`. Asyncband's receiver implements `IntoFuture`. Call `receiver.into_future()` once and retain the returned `Recv` future, then select on `&mut recv` when the receive should survive another branch winning. Dropping the Asyncband receiver or its receive future disconnects the channel and discards any unread message.

## Additional coordination APIs

Asyncband also provides dedicated APIs for the following tasks:

| Asyncband API                                                                                     | Use                                                                                |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`Latch`](https://docs.rs/asyncband/0.7.3/asyncband/latch/struct.Latch.html)                      | Wait for a one-shot countdown to reach zero.                                       |
| [`WaitGroup`](https://docs.rs/asyncband/0.7.3/asyncband/waitgroup/struct.WaitGroup.html)          | Wait for a dynamically registered set of workers to finish.                        |
| [`Phaser`](https://docs.rs/asyncband/0.7.3/asyncband/phaser/struct.Phaser.html)                   | Coordinate multiple phases with a changing participant set.                        |
| [`Condvar`](https://docs.rs/asyncband/0.7.3/asyncband/condvar/struct.Condvar.html)                | Wait for a predicate protected by an Asyncband mutex.                              |
| [`Once`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.Once.html)                         | Complete one successful initialization without storing its result.                 |
| [`LazyCell`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.LazyCell.html)                 | Own an initializer and preserve its in-progress future across caller cancellation. |
| [`OnceMap`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html)                   | Initialize and retain values independently by key.                                 |
| [`singleflight::Group`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html) | Share work among overlapping calls for a key without retaining a cache afterward.  |
| [`pool`](https://docs.rs/asyncband/0.7.3/asyncband/pool/index.html)                               | Reuse objects through bounded or unbounded pools.                                  |
