---
title: "Using Semaphores to Control In-Flight Work"
description: "Use Asyncband's Semaphore to share concurrency limits, keep permits with the resources they account for, and reserve capacity for work of different sizes."
authors: [nanami, tison]
tags: [async rust, concurrency]
---

An asynchronous program can start work faster than the resources behind it can handle. Downloads compete for connections and bandwidth. Background jobs compete for CPU time. Buffered data occupies memory until its consumer finishes with it. A semaphore gives these operations a shared budget: work acquires permits before consuming capacity and returns them when that capacity becomes available again.

The useful questions are **what one permit represents, which operations share the budget, and how long each operation holds its permits**. This post works through those choices with Asyncband's [`Semaphore`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html), including how Apache OpenDAL and prek use it.

<!-- truncate -->

_The Asyncband APIs below are from version 0.7.3, with the `semaphore` feature enabled. The HTTP example uses reqwest; the semaphore itself is runtime-independent._

## Share a budget across operations

Suppose a client should perform at most eight downloads at once. Create one `Semaphore::new(8)` and share it across the calls that consume that budget. Each download acquires one permit. When all eight are held, another acquisition waits asynchronously until capacity becomes available.

```rust
use asyncband::semaphore::Semaphore;

async fn download(
    client: &reqwest::Client,
    slots: &Semaphore,
    url: &str,
) -> Result<Vec<u8>, reqwest::Error> {
    let _permit = slots.acquire(1).await;
    let response = client.get(url).send().await?.error_for_status()?;
    Ok(response.bytes().await?.to_vec())
}
```

`acquire` returns a guard. Keeping that guard in `_permit` holds the slot through the download, including reading the response body. Returning from the function drops the guard and gives the slot back, including on an error. There is no separate success or error branch that needs to release it manually.

The semaphore must live outside the individual calls. Creating a new semaphore inside `download` would give every call its own eight-slot budget. An `Arc<Semaphore>` lets independently owned tasks share the same budget; each task can borrow it for `acquire` or use `acquire_owned` when the permit itself must own a reference to the semaphore.

This is useful when work comes from several places. Apache OpenDAL's [`ConcurrentLimitLayer`](https://github.com/apache/opendal/blob/ee8be2353d6af6152f6293cb8ac0b4d3d7a234d7/core/layers/concurrent-limit/src/lib.rs) lets multiple operators share an Asyncband semaphore. The hook runner [prek](https://github.com/j178/prek/blob/735c452028a698ce99ae5821dda9baedd0e07037/crates/prek/src/cli/run/run.rs) similarly passes one semaphore through project runs to limit concurrent hook execution. The scope of the shared semaphore determines the scope of the limit.

Eight slots limit simultaneous downloads. The number completed per second still depends on their duration. A policy expressed in requests per second needs a time-based rate limiter.

## Keep the permit with the resource

In the example above, the download ends when the response body has been read. A streaming API has a different lifetime: it can return a response while the caller is still receiving its body. Releasing a permit when the response is returned would leave that later transfer outside the budget.

OpenDAL handles this at its [HTTP transport boundary](https://github.com/apache/opendal/blob/ee8be2353d6af6152f6293cb8ac0b4d3d7a234d7/core/layers/concurrent-limit/src/lib.rs#L191). When an HTTP concurrency limit is configured, it acquires a permit before sending the request and moves the permit into a wrapper around the response body stream. The stream holds the permit until it is dropped. If sending the request fails, the local permit is dropped instead.

That ownership pattern also applies to a returned buffer or a queued job: put the permit in the object that owns the charged resource. If ownership moves to another task, move the permit with it. The function that acquired the permit may return long before the resource is released.

The download example's returned `Vec<u8>` illustrates the boundary. Its slot covers the transfer, but the caller can retain the downloaded bytes afterward. Limiting transfers alone does not bound retained memory.

## Charge for the size of the work

A permit can represent a byte of capacity instead of one operation. This matters when a small buffer and a large buffer should consume different amounts of a shared budget.

Here is a standalone example of a fixed payload budget. It reserves capacity before allocating a buffer and keeps the reservation with the returned value:

```rust
use std::sync::Arc;

use asyncband::semaphore::{OwnedSemaphorePermit, Semaphore};

struct BufferBudget {
    capacity: usize,
    available: Arc<Semaphore>,
}

struct BudgetedBuffer {
    data: Vec<u8>,
    _permit: OwnedSemaphorePermit,
}

impl BufferBudget {
    fn new(capacity: usize) -> Self {
        Self {
            capacity,
            available: Arc::new(Semaphore::new(capacity)),
        }
    }

    async fn allocate(&self, len: usize) -> Option<BudgetedBuffer> {
        if len > self.capacity {
            return None;
        }

        let permit = self.available.clone().acquire_owned(len).await;
        Some(BudgetedBuffer {
            data: vec![0; len],
            _permit: permit,
        })
    }
}
```

With `BufferBudget::new(8 * 1024 * 1024)`, the budget covers eight MiB of payload. A 64 KiB allocation charges 64 KiB; a two MiB allocation charges two MiB. The buffer and its reservation can move together between tasks. Dropping the buffer frees its data and returns the permits.

Rejecting a request larger than the entire fixed budget is necessary: returning every outstanding permit could still never satisfy it. Reserve the full amount in one acquisition, too. Acquiring a large reservation incrementally can leave several callers each holding some capacity while all wait for the rest.

This budget counts the payload bytes in these buffers. Allocator overhead, other allocations, and extra copies require their own accounting. Growing or copying a buffer must reserve the additional capacity before doing so.

## Decide what happens when capacity runs out

Waiting is one admission policy. `acquire(n).await` waits for capacity; `try_acquire(n)` returns `None` when it cannot acquire the requested permits immediately. A caller can use the latter to reject or defer work instead of joining the wait queue. A deadline around `acquire` gives waiting a time limit.

The placement of the acquisition matters. If a program allocates a large payload and only then waits for its permit, that payload already consumes memory outside the budget. Likewise, spawning one task per incoming job and acquiring inside each task limits admitted work while allowing an arbitrarily large population of waiting tasks. Apply admission before creating the resource whose growth you intend to bound, or bound the waiting population separately.

Asyncband assigns permits to queued acquisitions in order. A large acquisition at the front can therefore hold back smaller ones behind it. If a budget has three units left and the first waiter needs five, a later one-unit waiter waits too. This preserves ordering, with a latency cost when request sizes vary substantially.

Dropping a pending acquisition removes it from the queue without leaking permits; retrying joins at the back. After acquisition completes, dropping the permit guard returns its permits. This accounting does not undo application side effects or stop work that has been handed to another task; the task doing that work must retain the permit for its actual lifetime.

## Adjust a running budget

Some applications change their concurrency budget while work is already running. Asyncband provides two operations for this: `release(n)` adds capacity, and [`reduce_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.reduce_permits) removes exactly `n` permits from the logical balance. A reduction does not revoke permits that callers already hold. If insufficient permits are currently available, later returns repay the deficit before ordinary queued acquisitions proceed.

For example, suppose an eight-slot budget is fully occupied and its controller reduces it by three. The eight operations can finish normally. As their guards are dropped, three returned permits retire the deficit; after all eight return, five slots remain available. The controller should serialize budget changes so that each adjustment is applied once.

[`drain_permits(n)`](https://docs.rs/asyncband/0.7.3/asyncband/semaphore/struct.Semaphore.html#method.drain_permits) only removes permits that are available at the time and returns the number removed. Draining three from that fully occupied budget removes zero, so it cannot promise the same capacity reduction. Also, returning an ordinary guard already restores its permits: an additional `release` would add capacity a second time.

For a fixed limit, acquiring and dropping guards is enough. Add weighted reservations or capacity adjustments when the resource being controlled calls for them, and keep the permit's lifetime aligned with the work it accounts for.
