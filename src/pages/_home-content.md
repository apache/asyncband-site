## Overview

Asyncband's async APIs are built on standard futures and wakers. Applications can poll its futures with Tokio, async-std, smol, a custom executor, or any other standards-based runtime, and compose runtime services such as deadlines around them.

The library never:

* spawns tasks
* owns worker threads
* installs timers
* requires a reactor or I/O driver

### Project scope

The project is not limited to small or stateless synchronization primitives. Stateful utilities such as a singleflight group or an object pool fit when they provide a generally reusable coordination mechanism and remain independent of executor policy.

The boundary is mechanism versus policy:

| Mechanism — Asyncband provides                                                                     | Policy — stays with the caller and its runtime                                                            |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Synchronization, initialization, task coordination, channels, resource reuse, and workload control | Task placement, timers, deadlines, retries, periodic maintenance, and application lifecycle orchestration |

Potential future-concurrency or scheduling APIs are evaluated against the same boundary: they must remain executor-independent and compose with caller-owned execution and timing.

## Getting started

The crate enables no APIs by default. Enable only the features your application uses:

```shell
cargo add asyncband --features mutex
```

```rust
use asyncband::mutex::Mutex;

async fn increment() {
    let counter = Mutex::new(0);
    *counter.lock().await += 1;
    assert_eq!(*counter.lock().await, 1);
}
```

Public paths stay direct while Cargo features keep unused implementations out of the build.

## Synchronous interoperability

The optional `blocking` module is a boundary adapter for synchronous callers. It parks the calling thread while driving one future; it is not a general-purpose executor.

```shell
cargo add asyncband --features blocking,oneshot
```

```rust
use std::thread;

use asyncband::blocking::FutureExt as _;
use asyncband::oneshot;

let (sender, receiver) = oneshot::channel();
thread::spawn(move || {
    let result = 6 * 7;
    sender.send(result).unwrap();
});

assert_eq!(receiver.block_on(), Ok(42));
```

### Async first, blocking by adaptation

Async and synchronous synchronization primitives have different optimization constraints. Once an async operation is exposed as a runtime-agnostic future, synchronous code can usually drive that future through a `block_on` adapter. Asyncband therefore designs its primitives for async use and provides blocking interoperability at the boundary instead of duplicating synchronous methods across every type.

A sync-first implementation can exploit OS- or platform-specific facilities that an async implementation cannot assume. Libraries focused on synchronous code can therefore make different and sometimes better tradeoffs. Asyncband leaves those optimizations to dedicated libraries rather than treating blocking adaptation as a second family of primitives.

:::info Execution constraints

The `blocking` module is a lightweight, thread-parking single-future executor, not a general-purpose async runtime. `wait_timeout` drops the future on timeout. Futures that depend on a runtime-specific timer or I/O driver still need that runtime's driver to make progress, and blocking an executor thread can cause starvation or deadlocks. See the [`blocking` module documentation](https://docs.rs/asyncband/*/asyncband/blocking/) for the full contract.

:::

## Thread safety

Asyncband types implement `Send` and `Sync` only when the protected, transferred, or managed value satisfies the necessary bounds. See each API's documentation for its exact contract.

## Minimum Supported Rust Version (MSRV)

This crate is built against the latest stable release, and its minimum supported rustc version is 1.86.0.

The policy is that the minimum Rust version required to use this crate can be increased in minor version updates. For example, if Asyncband 1.0 requires Rust 1.20.0, then Asyncband 1.0.z for all values of z will also require Rust 1.20.0 or newer. However, Asyncband 1.y for y > 0 may require a newer minimum version.

## License and Trademarks

This project is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

Apache Asyncband, Asyncband, and Apache are either registered trademarks or trademarks of The Apache Software Foundation in the United States and/or other countries.
