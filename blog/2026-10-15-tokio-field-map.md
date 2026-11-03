---
title: "Moving from tokio::sync to Asyncband"
description: "How channel backpressure, semaphore acquisition, notifications, and initialization change when you migrate from tokio::sync to Asyncband."
authors: [nanami, tison]
tags: [migration, tokio]
---

You can keep the Tokio runtime when you switch synchronization primitives. Consider what happens when a bounded broadcast channel fills: Tokio lets a slow receiver miss messages, while Asyncband can make the sender wait for that receiver.

<!-- truncate -->

The examples use Tokio 1.53.3 and Asyncband 0.7.3. Asyncband has no default features; enable the features you need in `Cargo.toml`. For example, to use Asyncband's broadcast channel:

```toml
[dependencies.asyncband]
version = "=0.7.3"
features = ["broadcast"]
```

## Channels

### Broadcast

Tokio's bounded broadcast channel evicts the oldest message when a send would overflow the buffer. A receiver that missed that message gets `RecvError::Lagged` on its next receive:

```rust
let (tx, mut rx) = tokio::sync::broadcast::channel(1);

tx.send(1).unwrap();
tx.send(2).unwrap();

assert!(matches!(
    rx.recv().await,
    Err(tokio::sync::broadcast::error::RecvError::Lagged(1))
));
```

Asyncband's `broadcast::mpmc::bounded` keeps a message until each receiver that was subscribed when it was sent has read it or unsubscribed. When the buffer fills, `send(value).await` waits for space. Here the fast receiver has already read the first message, but `try_send(2)` still fails until the slow receiver reads it too:

```rust
use asyncband::broadcast::mpmc::{self, TrySendError};

let (tx, mut fast) = mpmc::bounded(1);
let mut slow = tx.subscribe();

tx.try_send(1).unwrap();
assert_eq!(fast.try_recv(), Ok(1));
assert!(matches!(tx.try_send(2), Err(TrySendError::Full(2))));

assert_eq!(slow.try_recv(), Ok(1));
tx.try_send(2).unwrap();
```

The send result also changes. Tokio's `send()` returns a receiver count on success or `SendError` if there are no receivers. Asyncband's bounded `send().await` returns `()` and retains nothing if there are no receivers.

### MPSC

Replace Tokio's `mpsc::channel(capacity)` with `mpsc::bounded(capacity)`. For an unbounded channel, replace `unbounded_channel()` with `unbounded()`.

```diff
- let (tx, mut rx) = tokio::sync::mpsc::channel::<u32>(16);
+ let (tx, mut rx) = asyncband::mpsc::bounded::<u32>(16);
```

After all senders have been dropped, both channels still deliver buffered messages. Once the buffer is empty, Tokio's `recv()` returns `None`; Asyncband's returns `Err(RecvError::Disconnected)`:

```rust
use asyncband::mpsc::{self, RecvError};

let (tx, mut rx) = mpsc::bounded(1);
tx.send(42).await.unwrap();
drop(tx);

assert_eq!(rx.recv().await, Ok(42));
assert_eq!(rx.recv().await, Err(RecvError::Disconnected));
```

### Watch

Tokio's `borrow()` and `borrow_and_update()` return read guards. Asyncband's `get()` clones the latest value without marking it seen. Use `recv().await` to wait for an unseen version, clone the value, and mark that version seen in one call. Intermediate updates can be coalesced.

```diff
- let value = rx.borrow().clone();
+ let value = rx.get();

- rx.changed().await?;
- let value = rx.borrow_and_update().clone();
+ let value = rx.recv().await?;
```

### Oneshot

Both receivers support `rx.await`. The difference shows up in a `select!` loop: Tokio's receiver implements `Future`, while Asyncband's implements `IntoFuture`. Convert it once before the loop so a timer tick can win without discarding the pending receive. Import `IntoFuture` explicitly for Rust 2021 callers.

```diff
+ use std::future::IntoFuture;
+
- let mut recv = rx;
+ let mut recv = rx.into_future();

  loop {
      tokio::select! {
          result = &mut recv => {
              handle(result?);
              break;
          }
          _ = tick.tick() => {}
      }
  }
```

## Semaphore

Replace Tokio's `acquire().await?` with `acquire(1).await` for a single permit. For a batch, Tokio's `acquire_many` takes a `u32`; Asyncband's `acquire` takes a `usize` and returns a guard directly:

```diff
  let n: u32 = 3;
- let permits = semaphore.acquire_many(n).await?;
+ let permits = semaphore.acquire(usize::try_from(n)?).await;
```

The remaining `?` handles the integer conversion. If your count is already a `usize`, pass it directly.

Tokio's `Semaphore::close()` makes pending and subsequent `acquire` calls fail with `AcquireError`. Asyncband has no closed state: a request that cannot be satisfied can wait indefinitely. If you relied on closure to stop workers, select between acquisition and a [shutdown request](#shutdown).

To add capacity, replace Tokio's `add_permits(n)` with Asyncband's `release(n)`. Here the semaphore starts empty, but the permit is available by the time `acquire(1)` runs:

```rust
let sem = asyncband::semaphore::Semaphore::new(0);
assert!(sem.try_acquire(1).is_none());

sem.release(1);
let permit = sem.acquire(1).await;
assert_eq!(permit.permits(), 1);
```

### Adjusting capacity

Asyncband's `drain_permits(n)`, like Tokio's `forget_permits(n)`, removes only currently available permits and returns the number removed. Use `reduce_permits(n)` to shrink the budget even when permits are checked out. Here draining removes nothing; reducing by three leaves five permits once the guard is dropped:

```rust
use asyncband::semaphore::Semaphore;

let sem = Semaphore::new(8);
let held = sem.acquire(8).await;

assert_eq!(sem.drain_permits(3), 0);
sem.reduce_permits(3);
drop(held);

assert_eq!(sem.available_permits(), 5);
```

## Notify and Event

### AutoResetEvent

Tokio's `notify_one()` wakes one waiter or stores one signal for a later wait. Asyncband's `AutoResetEvent::set()` does the same. When no waits are registered, repeated calls store just one signal:

```diff
- notify.notify_one();
- notify.notified().await;
+ event.set();
+ event.wait().await;
```

### ManualResetEvent

Tokio's `notify_waiters()` reaches `Notified` futures **created before the call**, even if they have never been polled. The call leaves no signal for a future created afterward:

```rust
use std::{future::Future, task::{Context, Poll, Waker}};

let mut cx = Context::from_waker(Waker::noop());
let notify = tokio::sync::Notify::new();
let mut before = Box::pin(notify.notified());
notify.notify_waiters();
let mut after = Box::pin(notify.notified());

assert_eq!(before.as_mut().poll(&mut cx), Poll::Ready(()));
assert_eq!(after.as_mut().poll(&mut cx), Poll::Pending);
```

Asyncband's `ManualResetEvent` stays set until `reset()`, so even a new wait can pass while the event is set. In the example below both waits are created before `set()`, but only one is polled and registered. That wait stays ready across the reset; the other first sees the event after it has been reset. A `set()`/`reset()` pair therefore cannot substitute for `notify_waiters()`.

```rust
use std::{future::Future, task::{Context, Poll, Waker}};

let mut cx = Context::from_waker(Waker::noop());
let event = asyncband::event::ManualResetEvent::new();
let mut unpolled = Box::pin(event.wait());
let mut registered = Box::pin(event.wait());
assert_eq!(registered.as_mut().poll(&mut cx), Poll::Pending);

event.set();
event.wait().await; // A new wait passes while the event is set.
event.reset();

assert_eq!(registered.as_mut().poll(&mut cx), Poll::Ready(()));
assert_eq!(unpolled.as_mut().poll(&mut cx), Poll::Pending);
```

## Once

### OnceCell

Tokio's `OnceCell::set(value)` is synchronous. If another task is initializing the cell, it immediately returns `SetError::InitializingError(value)`. Asyncband's `once::OnceCell` (feature `once-cell`) waits for that attempt. It can install `value` if the cell is still empty; otherwise it returns `Err(value)` with the unused input. Code that propagated Tokio's error with `?` may need to handle that value explicitly or convert it to an application error.

```rust
use asyncband::once::OnceCell;

let cell = OnceCell::new();
cell.set(42).await.unwrap();

let rejected = cell.set(7).await.unwrap_err();
assert_eq!(rejected, 7);
assert_eq!(cell.get(), Some(&42));
```

### SetOnce and Completion

Tokio's `SetOnce` lets one task wait for a value set by another. Asyncband separates those roles: a single-use `Completer` publishes the value, and cloneable `Completion` handles observe it.

```rust
let cell = tokio::sync::SetOnce::new();
cell.set(42).unwrap();
assert_eq!(*cell.wait().await, 42);
```

```rust
let (completer, completion) = asyncband::completion::new();
let observer = completion.clone();
completer.complete(42).unwrap();
assert_eq!(*observer.wait().await.unwrap(), 42);
```

If the `Completer` is dropped without publishing, observers receive `Abandoned`. A Tokio `SetOnce` waiter would keep waiting if nobody set the value. For initialization with no stored value, Asyncband's [`once::Once`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.Once.html) (feature `once`) lets one task run the initializer with `call_once()` and others `wait().await` without supplying one.

## Additional Asyncband APIs

### Shutdown

If you used a closed semaphore to signal shutdown, give each worker a `ShutdownGuard` and let it select between the request and the permit. Here the semaphore has no permits. Awaiting `shutdown` requests shutdown and waits for all guards to drop; the worker takes the shutdown branch and drops its guard when it returns.

```rust
let sem = asyncband::semaphore::Semaphore::new(0);
let (shutdown, guard) = asyncband::shutdown::new();

let worker = async move {
    tokio::select! {
        _ = guard.shutdown_requested() => false,
        _permit = sem.acquire(1) => true,
    }
};

let (acquired, ()) = tokio::join!(worker, shutdown);
assert!(!acquired);
```

This cancels the participating worker's acquisition. It does not close the semaphore for other callers.

### LazyCell

An async `LazyCell` stores its initializer without starting it. Pin the cell to drive an inline async initializer with `force_pin`. If that call is cancelled, a later caller can resume the same initializer.

```rust
use asyncband::once::LazyCell;

let lazy = LazyCell::new(async || 42);
assert_eq!(LazyCell::get(&lazy), None);

let lazy = std::pin::pin!(lazy);
assert_eq!(*LazyCell::force_pin(lazy.as_ref()).await, 42);
```

### OnceMap and Singleflight

Use `OnceMap::compute` to retain a value by key. If the value itself is a `Result`, `compute` caches an `Err` just like any other value. Use `try_compute` when a failed load should be retried:

```rust
use asyncband::once::OnceMap;

let ports = OnceMap::new();
let invalid = ports.try_compute("http", async || "n/a".parse::<u16>()).await;
assert!(invalid.is_err());

let retry = ports.try_compute("http", async || "8080".parse::<u16>()).await;
assert_eq!(retry, Ok(8080));
assert_eq!(ports.get("http"), Some(8080));
```

If callers should share only **in-flight** work, use [`singleflight::Group`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html). A call for the same key after the work completes starts a new computation.

### Other coordination patterns

* **Wait for workers:** use a [`Latch`](https://docs.rs/asyncband/0.7.3/asyncband/latch/struct.Latch.html) for a fixed countdown, or a [`WaitGroup`](https://docs.rs/asyncband/0.7.3/asyncband/waitgroup/struct.WaitGroup.html) when workers join by cloning a handle and finish by dropping it.
* **Coordinate phases:** a [`Phaser`](https://docs.rs/asyncband/0.7.3/asyncband/phaser/struct.Phaser.html) lets participants register and withdraw. Dropping a participant removes it from later phases and lets the current phase finish without waiting for its arrival.
* **Wait for a condition:** a [`Condvar`](https://docs.rs/asyncband/0.7.3/asyncband/condvar/struct.Condvar.html) releases the mutex while waiting and reacquires it before rechecking the predicate.
* **Reuse resources:** [object pools](https://docs.rs/asyncband/0.7.3/asyncband/pool/index.html) can cap the number of managed connections in a bounded pool or keep idle buffers for reuse in an unbounded one.
