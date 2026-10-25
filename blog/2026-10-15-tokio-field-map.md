---
title: "Moving from tokio::sync to Asyncband"
description: "A guide to corresponding synchronization APIs and the differences in initialization, notifications, permit accounting, and channel behavior."
authors: [nanami, tison]
tags: [migration, tokio]
---

*Versions: Asyncband 0.7.3, Tokio 1.53.3*

Asyncband is a runtime-agnostic library of asynchronous synchronization primitives. Some serve similar purposes to those in `tokio::sync`, but make different trade-offs in API design and behavior.

We'll examine these differences and identify assumptions to revisit when migrating.

Asyncband has no default features; enable the features for the APIs you use in `Cargo.toml`.


<!-- truncate -->

## Once

Tokio's `OnceCell::set()` is synchronous. If another task is already initializing the cell, it immediately returns `SetError::InitializingError`. Asyncband's `set()` instead waits for the ongoing initialization to finish before attempting to set the value:

```diff
- cell.set(value)?;
+ cell.set(value).await?;
```

Tokio's `SetOnce` lets tasks wait for a value set by another task. Asyncband splits setting and waiting between `Completer` and `Completion`.

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

A `Completion` can be cloned so multiple tasks can wait for the same result. If the `Completer` is dropped before `complete()` is called, every waiter receives an `Abandoned` error. Tokio's `SetOnce` would instead keep waiting for a value.

Asyncband's `once::Once` supports asynchronous initialization. Unlike `std::sync::Once`, a panic does not poison it; cancelled initialization can also be retried.

`wait().await` lets callers wait for initialization to complete without providing an initializer:

```rust
use asyncband::once::Once;

let once = Once::new();

tokio::join!(
    once.call_once(async || initialize().await),
    async {
        once.wait().await;
        use_initialized_state().await;
    },
);
```

## Notify and Event

Tokio's `Notify` can notify one waiter with `notify_one()` or all waiters with `notify_waiters()`. Asyncband separates these behaviors into `AutoResetEvent` and `ManualResetEvent`.

### AutoResetEvent

`AutoResetEvent::set()` and `wait()` correspond to Tokio's `notify_one()` and `notified()`:

```diff
- notify.notify_one();
- notify.notified().await;
+ event.set();
+ event.wait().await;
```

### ManualResetEvent

Tokio's `notify_waiters()` notifies `Notified` futures created before the call, even if they have not yet been polled:

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

After `set()`, Asyncband's `ManualResetEvent` remains signaled until `reset()` is called. The future returned by `wait()` checks the event state on its first poll and registers as a waiter if it is not signaled.

```rust
use std::{future::Future, task::{Context, Poll, Waker}};

let mut cx = Context::from_waker(Waker::noop());

let event = asyncband::event::ManualResetEvent::new();

let mut wait_after_reset = Box::pin(event.wait());

let mut wait_before_set = Box::pin(event.wait());
assert_eq!(wait_before_set.as_mut().poll(&mut cx), Poll::Pending);

event.set();
event.wait().await;
event.reset();

assert_eq!(wait_after_reset.as_mut().poll(&mut cx), Poll::Pending);
assert_eq!(wait_before_set.as_mut().poll(&mut cx), Poll::Ready(()));

event.set();
assert_eq!(wait_after_reset.as_mut().poll(&mut cx), Poll::Ready(()));
```

## Semaphore

Asyncband uses `acquire(n)` to acquire one or multiple permits, rather than Tokio's separate `acquire()` and `acquire_many(n)` methods:

```diff
- let permit = semaphore.acquire().await?;
- let permits = semaphore.acquire_many(3).await?;
+ let permit = semaphore.acquire(1).await;
+ let permits = semaphore.acquire(3).await;
```

Tokio's `Semaphore::close()` causes pending and subsequent acquisition attempts to return `AcquireError`:

```rust
let sem = tokio::sync::Semaphore::new(0);
sem.close();

assert!(sem.acquire().await.is_err());
```

Asyncband's `Semaphore` cannot be closed. `acquire(n)` returns a permit guard rather than a `Result` and waits until enough permits are available. Code that relies on Tokio's `close()` to stop pending acquisitions needs a separate cancellation mechanism:

```rust
let sem = asyncband::semaphore::Semaphore::new(0);

assert!(sem.try_acquire(1).is_none());

sem.release(1);
let _permit = sem.acquire(1).await; // Waits while no permits are available
```

### Adjusting Capacity

`drain_permits(n)` corresponds to Tokio's `forget_permits(n)`. It removes only currently available permits and returns the number actually removed. `reduce_permits(n)` instead reduces the logical capacity.

```rust
use asyncband::semaphore::Semaphore;

let sem = Semaphore::new(8);
let held = sem.acquire(8).await;

assert_eq!(sem.drain_permits(3), 0);

sem.reduce_permits(3);
drop(held);

assert_eq!(sem.available_permits(), 5);
```

## Channel

### MPSC

Tokio's `channel(capacity)` and `unbounded_channel()` correspond to Asyncband's `bounded(capacity)` and `unbounded()`:

```diff
- let (tx, mut rx) = tokio::sync::mpsc::channel::<u32>(16);
+ let (tx, mut rx) = asyncband::mpsc::bounded::<u32>(16);
```

Tokio's `recv()` returns `Option<T>`, yielding `None` when all senders have disconnected and the buffer is empty. Asyncband's `recv()` returns `Result<T, RecvError>`, yielding `Err(RecvError)` in the same case.

```rust
let (tx, mut rx) = asyncband::mpsc::bounded(1);
tx.send(42).await.unwrap();
drop(tx);

assert_eq!(rx.recv().await, Ok(42));
assert!(rx.recv().await.is_err());
```

### Broadcast

Tokio's bounded broadcast channel overwrites the oldest messages when the buffer is full, rather than waiting for slow receivers. Receivers that fall behind get `RecvError::Lagged`:

```rust
let (tx, mut rx) = tokio::sync::broadcast::channel(1);

tx.send(1).unwrap();
tx.send(2).unwrap();

assert!(matches!(
    rx.recv().await,
    Err(tokio::sync::broadcast::error::RecvError::Lagged(1))
));
```

Asyncband's bounded `broadcast::mpmc` does not overwrite messages that active receivers have not yet read. When the buffer is full, `send().await` waits, while `try_send()` returns `Full`:

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

Tokio's `send()` returns the number of receivers on success or `SendError` when there are none. Asyncband's `send()` returns `()` and discards messages if there are no active receivers.

### Watch

Tokio's `borrow()` and `borrow_and_update()` return read guards. Asyncband's `get()` and `recv()` return clones of the current value:

```diff
- let value = rx.borrow().clone();
+ let value = rx.get();

- rx.changed().await?;
- let value = rx.borrow_and_update().clone();
+ let value = rx.recv().await?;
```

### Oneshot

Tokio's oneshot `Receiver` implements `Future` directly. Asyncband separates the receiver from the receive future: its `Receiver` implements `IntoFuture`, which produces a `Recv` future.

Both support `rx.await`. When reusing a receive operation across iterations of a `select!` loop, Tokio can poll `&mut rx` directly; Asyncband requires converting the receiver into a future first:

```diff
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

## Additional Asyncband APIs

### Shutdown

`shutdown.await` issues a shutdown request and waits until all `ShutdownGuard` handles have been dropped.

```rust
let (shutdown, guard) = asyncband::shutdown::new();

tokio::spawn(async move {
    guard.shutdown_requested().await;
    cleanup().await;
});

shutdown.await;
```

A `ShutdownGuard` can be cloned for multiple tasks.

### Latch and WaitGroup

`Latch` waits for a fixed number of operations to finish. Each `count_down()` decrements the count; `wait()` completes when it reaches zero:

```rust
use asyncband::latch::Latch;

let latch = Latch::new(1);

tokio::join!(
    async {
        initialize().await;
        latch.count_down();
    },
    async {
        latch.wait().await;
        start_service().await;
    },
);
```

`WaitGroup` does not require an initial count. Cloning a handle adds a participant, and dropping it marks that participant as finished:

```rust
use asyncband::waitgroup::WaitGroup;

let group = WaitGroup::new();
let worker = group.clone();

tokio::spawn(async move {
    process().await;
    drop(worker);
});

group.await;
```

### Phaser

`Phaser` synchronizes tasks across multiple phases. Each participant calls `wait()` to mark its arrival at the current phase; the next phase begins after all participants have arrived. Dropping a participant removes it from subsequent phases.

```rust
use asyncband::phaser::Phaser;

let phaser = Phaser::new();
let mut a = phaser.register_one()?;
let mut b = phaser.register_one()?;

let (phase_a, phase_b) = tokio::join!(a.wait(), b.wait());
assert_eq!(phase_a?, 1);
assert_eq!(phase_b?, 1);

drop(b);
assert_eq!(a.wait().await?, 2);
```

### Condvar

`Condvar` notifies waiting tasks but does not store application state, so it is normally paired with a `Mutex` protecting that state. `wait_while()` takes a `MutexGuard` and a predicate. While the predicate is `true`, it releases the lock and waits for a notification. After a notification, it reacquires the lock and checks the condition again, returning when the predicate is `false`.

```rust
use asyncband::{condvar::Condvar, mutex::Mutex};

let ready = Mutex::new(false);
let condvar = Condvar::new();

tokio::join!(
    async {
        let ready = condvar
            .wait_while(ready.lock().await, |ready| !*ready)
            .await;
        assert!(*ready);
    },
    async {
        *ready.lock().await = true;
        condvar.notify_one();
    },
);
```

### LazyCell

The standard library's `LazyCell` and `LazyLock` initialize synchronously on first access. Asyncband's `once::LazyCell` supports asynchronous initialization.

```rust
use asyncband::once::LazyCell;

let lazy = LazyCell::new(async || future().await);
```

### OnceMap and Singleflight

`OnceMap` and `singleflight::Group` both deduplicate concurrent work for the same key. `OnceMap` caches successful results, while `singleflight` shares work only among overlapping calls:

```rust
use asyncband::{once::OnceMap, singleflight::Group};

let cache = OnceMap::new();
let group = Group::new();

let cached = cache
    .compute("key", async || load_value().await)
    .await;

let result = group
    .work("key", async || load_value().await)
    .await;
```

### Pool

Asyncband provides bounded and unbounded object pools. A bounded pool requires a manager implementing `ManageObject`.

```rust
pub trait ManageObject: Send + Sync {
    type Object: Send;
    type Error: Send;

    fn create(&self) -> impl Future<Output = Result<Self::Object, Self::Error>> + Send;

    fn is_recyclable(
        &self,
        object: &mut Self::Object,
        status: &ObjectStatus,
    ) -> impl Future<Output = Result<(), Self::Error>> + Send;

    fn on_detached(&self, _object: &mut Self::Object) {}
}
```

With a `Manager` implementing `ManageObject`:

```rust
use asyncband::pool::{bounded, unbounded};

let bounded = bounded::Pool::new(bounded::PoolConfig::new(16), Manager);
let bounded_object: Result<_, _> = bounded.get().await;

let unbounded = unbounded::Pool::new(unbounded::PoolConfig::default(), Manager);
let unbounded_object: Result<_, _> = unbounded.get().await;
```

Unbounded pools accept objects through `extend_one()`. An unbounded pool created with `never_manage()` doesn't need a custom manager and provides additional methods: `try_get()` and `get_or_create()`:

```rust
let pool = unbounded::Pool::<Vec<u8>>::never_manage(Default::default());

pool.extend_one(Vec::with_capacity(4096));
let reused: Option<_> = pool.try_get();
let created: Result<_, ()> = pool
    .get_or_create(async || Ok(Vec::new()))
    .await;
```
