---
title: "Counting, Signaling, and Cancelling: Choosing the Right Asyncband Primitive"
description: "A field guide to picking between Semaphore, ManualResetEvent, and AutoResetEvent, and the sharp edges worth knowing before you rely on them."
authors: [nanami]
tags: [async rust, concurrency]
---

_This post is written against asyncband 0.7 (links point to the 0.7.3 docs); the crate is still pre-1.0, so later versions may require some adjustment._

Asyncband ships a wide box of coordination primitives: locks, channels, latches, pools. Wide enough that the daily question is rarely "how do I use X" but "which X is this job". This post walks the three you will reach for most often — [`Semaphore`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html), [`ManualResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.ManualResetEvent.html), and [`AutoResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.AutoResetEvent.html) — through one question: **what is the unit of coordination?** A permit to count, a level to observe, or an edge to consume.

<!-- truncate -->

## Count when you bound work

A semaphore's state is a _number_. You reach for it when your condition is "no more than N of these at once": concurrent requests against one backend, buffers in flight, tasks sharing a scarce resource.

```rust
use asyncband::semaphore::Semaphore;

async fn handle(socket: Socket, limiter: &Semaphore) {
    // At most `limiter` handlers run at once; the others wait
    // without blocking a thread.
    let _permit = limiter.acquire(1).await;
    socket.serve().await;
    // Dropping the permit releases it, and the next waiter proceeds.
}
```

The returned guard is the whole accounting story: acquire to enter, drop to leave, and the count stays consistent even if a task panics or is cancelled mid-work.

## Signal when you notify

When your condition is not a number but a _fact_, counting permits is the wrong shape. Asyncband's events come in the two classic flavors, and the difference is how they treat state:

* [`ManualResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.ManualResetEvent.html) is a _level_. `set` releases every registered waiter and stays set — future waits pass immediately — until an explicit `reset`. Use it as a readiness gate: configuration loaded, connection established, shutdown initiated.
* [`AutoResetEvent`](https://docs.rs/asyncband/0.7.3/asyncband/event/struct.AutoResetEvent.html) is an _edge_. Each `set` delivers one signal to one waiter; if nobody is waiting, one signal is retained. Bursts coalesce: three sets with no consumer in between leave one stored signal, not three.

The clearest way to feel the difference is a workload that screams "queue" at first glance: a single worker that rebuilds a snapshot whenever a new revision is requested. Revisions arrive in bursts, but only the latest one matters — processing each intermediate revision would be wasted work. That rules out a channel: a channel's contract is that every sent value is delivered, which is exactly the work you want to _avoid_. A `ManualResetEvent` is also wrong: it would wake every consumer and stay set until reset, which is the wrong granularity for "something changed, re-check once".

An `AutoResetEvent` plus an atomic for the latest revision fits:

```rust
use std::sync::atomic::AtomicUsize;
use std::sync::atomic::Ordering;

use asyncband::event::AutoResetEvent;

struct Rebuilder {
    requested: AtomicUsize,
    changed: AutoResetEvent,
}

impl Rebuilder {
    fn request(&self, revision: usize) {
        self.requested.fetch_max(revision, Ordering::Release);
        self.changed.set();
    }

    async fn run(&self) {
        let mut rebuilt = 0;
        loop {
            let requested = self.requested.load(Ordering::Acquire);
            if requested != rebuilt {
                rebuild(requested).await; // a burst of 1, 2, 3 coalesces into "rebuild 3"
                rebuilt = requested;
            }
            self.changed.wait().await;
        }
    }
}
```

Many producers call `request`; one consumer wakes, observes the _latest_ state, and sleeps again. A signal that arrives between the state check and the wait is retained, so the worker cannot miss a change, and a leftover signal costs at most one extra predicate check. (This pattern is adapted from the `coalesced_worker` example in the [asyncband repository](https://github.com/apache/asyncband/tree/main/examples) — worth a read in full.)

## The sharp edges of counting

Semaphores look like the simplest primitive in the box, and most of the time they are. Four behaviors are worth internalizing before you build on them — all verified against the current implementation:

**An acquisition larger than the semaphore can ever grant never completes.** Permits arrive only when someone releases them. `acquire(5)` against a semaphore initialized with 3 and never topped up waits forever. Unlike a channel, there is no "closed" state that fails the wait; the caller owns the timeout.

**Pending acquisitions complete in request order, and a big one at the head holds back smaller ones behind it.** Permits are assigned to the queue head first. A partially satisfied `acquire(100)` keeps its place in line, so a stream of `acquire(1)` callers queued behind it waits until the big acquisition completes. This is fair — nobody jumps the line, and `try_acquire` cannot steal a handoff already assigned to a waiter — but if you mix sizes on one semaphore, mind the ordering interaction. One semaphore per size class avoids the coupling entirely.

**Cancelling a pending acquisition passes its credit forward.** Wrap `acquire` in a timeout or `select!` and the cancelled future returns the permits _already assigned to it_ to the next queued waiters — not to the available count. Nothing is lost and nothing leaks; the place in line is what you give up. So a timeout like this is always safe on the semaphore side:

```rust
match tokio::time::timeout(Duration::from_secs(1), sem.acquire(5)).await {
    Ok(permit) => serve(permit).await,
    Err(_elapsed) => {
        // Any of the 5 permits already credited to us went to the
        // next waiter, not back to the pool. Nothing leaked.
    }
}
```

**`drain_permits` and `reduce_permits` shrink by different rules.** [`drain_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.drain_permits) removes up to `n` _currently available_ permits and never creates a deficit; [`reduce_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.reduce_permits) removes exactly `n`, consuming future releases when fewer are available — those releases repay the deficit before any queued acquisition proceeds. Drain when you observe; reduce when you permanently remove capacity.

## Where to go next

The [API documentation](https://docs.rs/asyncband/) covers each primitive's ordering, cancellation, and memory-model contracts in detail, and the [examples crate](https://github.com/apache/asyncband/tree/main/examples) demonstrates the patterns above as complete runnable programs.
