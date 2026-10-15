---
title: "Coming from Tokio: A Field Map to Asyncband"
description: "The tokio::sync to asyncband translation table, plus the semantic edges that actually differ when you switch."
authors: [nanami]
tags: [async rust, migration, tokio]
---

_This post is written against asyncband 0.7 (links point to the 0.7.3 docs) and tokio 1.x; both move fast in places, so later versions may require some adjustment._

Most of `tokio::sync` has a direct counterpart in asyncband, and most of the time the mechanical translation — swap the import, rename the type, keep the `.await` — just works. That is not an accident: asyncband's queueing machinery descends from the same batch-semaphore lineage as tokio's, so the deep behaviors (FIFO fairness, cancel-safety, permit accounting under cancellation) match to a degree that will surprise anyone who has debugged them on the tokio side. The reason to make the switch is upstream of all that: asyncband carries no runtime of its own, which is what lets a library offer synchronization primitives without dragging a full executor into its dependency tree. This post is the map I wanted while porting: which type replaces which, and the handful of places where the translation needs care.

<!-- truncate -->

## The map

| You use in tokio         | Reach for in asyncband                                                                                                                                                                              | Notes                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `tokio::sync::Mutex`     | [`asyncband::mutex::Mutex`](https://docs.rs/asyncband/0.7.3/asyncband/mutex/struct.Mutex.html)                                                                                                      | FIFO-fair, guard-based, cancel-safe; `try_lock` returns an `Option` |
| `tokio::sync::RwLock`    | [`asyncband::rwlock::RwLock`](https://docs.rs/asyncband/0.7.3/asyncband/rwlock/struct.RwLock.html)                                                                                                  | Queue-order fairness; write guards can `downgrade`                  |
| `tokio::sync::Semaphore` | [`asyncband::semaphore::Semaphore`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html)                                                                                      | Multi-permit, FIFO — but has no closed state, see below             |
| `tokio::sync::Notify`    | [`AutoResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.AutoResetEvent.html) / [`ManualResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.ManualResetEvent.html) | Split by storage semantics — see below                              |
| `tokio::sync::Barrier`   | [`asyncband::barrier::Barrier`](https://docs.rs/asyncband/0.7.3/asyncband/barrier/struct.Barrier.html)                                                                                              | Reusable; exactly one leader per generation                         |
| `tokio::sync::oneshot`   | [`asyncband::oneshot`](https://docs.rs/asyncband/0.7.3/asyncband/oneshot/index.html)                                                                                                                | Single-use channel; `send` is synchronous                           |
| `tokio::sync::mpsc`      | [`asyncband::mpsc`](https://docs.rs/asyncband/0.7.3/asyncband/mpsc/index.html)                                                                                                                      | Bounded and unbounded; `reserve`/permit API included                |
| `tokio::sync::broadcast` | [`asyncband::broadcast`](https://docs.rs/asyncband/0.7.3/asyncband/broadcast/index.html)                                                                                                            | Lossless — a real behavioral difference, see below                  |
| `tokio::sync::watch`     | [`asyncband::watch`](https://docs.rs/asyncband/0.7.3/asyncband/watch/index.html)                                                                                                                    | Latest-value register, same observation model                       |

The reverse direction matters too: asyncband ships primitives tokio has no answer for — a [`Latch`](https://docs.rs/asyncband/0.7.3/asyncband/latch/struct.Latch.html) (one-shot countdown), a [`WaitGroup`](https://docs.rs/asyncband/0.7.3/asyncband/waitgroup/struct.WaitGroup.html), an async [`Condvar`](https://docs.rs/asyncband/0.7.3/asyncband/condvar/struct.Condvar.html), a deduplicating [`singleflight::Group`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html), and object [`pool`s](https://docs.rs/asyncband/0.7.3/asyncband/pool/index.html) — plus a [`Phaser`](https://docs.rs/asyncband/0.7.3/asyncband/phaser/struct.Phaser.html) for dynamic multi-phase rendezvous and the `once` family (`Once`, `OnceCell`, `LazyCell`, `OnceMap`) for async one-time initialization. If you have been hand-rolling any of those out of semaphores and notifies, there is a primitive here with your use case on the box.

## One Cargo.toml step before any of it

Asyncband's default feature set is empty: every primitive is opt-in, so a migration starts by enabling what you use.

```toml
asyncband = { version = "0.7", features = ["mutex", "semaphore", "event"] }
```

There is no crate-root prelude either — types live at their full paths (`asyncband::mutex::Mutex`, `asyncband::oneshot::channel`), and the [crate's API map](https://docs.rs/asyncband/0.7.3/asyncband/) is the intended discovery surface.

## What carries over unchanged

The best news first: the properties people most often depend on when reasoning about `tokio::sync` hold in asyncband too.

**Locks and semaphore waits are FIFO and cancel-safe.** Waiters complete in request order; a late `try_acquire` cannot barge past a queued waiter. Cancelling a pending `acquire` — a timeout, a dropped `select!` branch — loses only your place in line: permits already credited to you are handed to the next waiter, never lost or leaked. (Verified on both sides while writing this post: the two implementations agree on queue order, partial assignment at the queue head, and credit forwarding under cancellation.)

**Guards do the accounting.** Every acquisition returns a guard whose `Drop` is the release — panic-safe, cancellation-safe, no manual bookkeeping.

**`Barrier` behaves the same, including its sharp edge.** Both barriers are reusable across generations, report exactly one leader per generation, and — usefully to know — both document `wait` as _not_ cancel-safe: an arrival is recorded on first poll and never retracted, so in a `select!` you retain and re-poll the same future instead of calling `wait` again.

**`watch` and `oneshot` keep their shapes.** Watch is still a last-value-wins register: intermediate sends coalesce, `changed()` marks the value observed, peeking does not. Oneshot still delivers an error when the sender drops without sending, and `send` remains synchronous and runtime-free.

## The edges that differ

### Tokio's `Notify` splits into two events

`tokio::sync::Notify` packs two behaviors into one type, and asyncband deliberately separates them:

* `notify_one()` — wakes one waiter; if nobody waits, **stores one permit** for the next `notified().await`. Repeated calls coalesce: three notifications with no consumer leave one stored permit, not three.
* `notify_waiters()` — wakes every currently-registered waiter and **stores nothing**.

The asyncband counterpart of `notify_one` is [`AutoResetEvent::set`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.AutoResetEvent.html#method.set): one signal to one waiter, retained if nobody waits, bursts coalesced — the same storage shape. The counterpart of `notify_waiters` is where care is needed. [`ManualResetEvent::set`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.ManualResetEvent.html#method.set) also wakes every registered waiter, but it is a _level_, not an edge: it stays set until an explicit `reset`, so waiters that arrive later also pass immediately. `notify_waiters` guarantees no such thing — a waiter that subscribes after the call sleeps until the next notification. If you depended on that "wake exactly who is registered now" edge, model it explicitly (an event plus a generation counter or atomic flag you check before waiting) rather than assuming a `set`/`reset` pair is atomic.

### `Semaphore` has no closed state

In tokio, a semaphore can be shut down: `close()` makes every current and future `acquire` fail with an error, which many services use as a shutdown signal. Asyncband's [`Semaphore`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html) has no such state — it is a pure counter, a deliberate divergence. Consequences when porting:

* `acquire(...).await` returns the permit directly, not a `Result`. There is no error path, and no `.unwrap()` to delete.
* Code that relied on `close()` to unstick blocked acquirers needs an external signal — the crate ships a dedicated [`Shutdown`](https://docs.rs/asyncband/0.7.3/asyncband/shutdown/index.html) token for coordinated teardown, or `select!` against your own shutdown event.
* An acquisition larger than the semaphore can ever grant waits forever (there is no "closed" failure to save you), so timeouts remain the caller's responsibility.

### `broadcast` is lossless

Tokio's `broadcast` is a fixed-size ring: slow receivers miss messages and surface `RecvError::Lagged`, and a fast producer never waits. Asyncband's [`broadcast`](https://docs.rs/asyncband/0.7.3/asyncband/broadcast/index.html) is the opposite contract: every accepted value stays readable by every subscription active at accept time — there is no `Lagged` error because nothing is ever dropped. The cost of that guarantee is backpressure: with a bounded channel, a `send` waits while `capacity` messages remain unconsumed, so your slowest active consumer paces your producers. When porting, decide which failure mode you actually want — dropped updates on lag, or producers throttled by the slowest consumer — because moving the code across unchanged moves you from the first world to the second. (Values are cloned per receiving subscription, so keep the payload cheap to clone or wrap it in an `Arc`.)

### `oneshot` selection needs the future, not the receiver

Tokio's oneshot `Receiver` is itself a future, and `select!`-ing on `&mut receiver` is the cancel-safe idiom. Asyncband's `Receiver` implements `IntoFuture` instead: call `.into_future()` once, keep the returned `Recv` future, and branch on `&mut recv` — dropping the receiver or a pending `Recv` disconnects the channel and discards an unread message.

## Where to go next

The [examples crate](https://github.com/apache/asyncband/tree/main/examples) contains runnable programs for the patterns above, and the [API documentation](https://docs.rs/asyncband/) covers each primitive's ordering, cancellation, and memory-model contracts. If you are migrating an older `mea`-based build, the [rename guide](https://github.com/apache/asyncband/blob/main/MIGRATE.md) covers the `mea` → `asyncband` package switch.
