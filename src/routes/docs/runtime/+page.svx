---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
label: Runtime and Blocking
title: Runtime and Blocking | Apache Asyncband
description: Apache Asyncband runtime model, blocking interoperability, thread safety, and minimum Rust version.
canonical: https://asyncband.apache.org/docs/runtime/
headingIds:
  Async First, Blocking by Adaptation: async-first
  Minimum Supported Rust Version: msrv
tocLabels:
  Async First, Blocking by Adaptation: Async First
---

# Runtime and Blocking

## Runtime Agnostic

All asynchronous APIs in this library are runtime-agnostic. They can be used with Tokio, async-std, smol, or a custom executor.

The async primitives do not start threads, spawn tasks, or require a runtime-specific reactor. Await them inside any executor that polls standard Rust futures.

## Synchronous Interoperability

The optional `blocking` module bridges synchronous Rust code to runtime-agnostic futures.

```bash
cargo add asyncband --features blocking
```

```rust
use std::time::Duration;

use asyncband::blocking::FutureExt as _;

let value = async { 42 }.block_on();
assert_eq!(value, 42);

let value = async { 42 }.wait_timeout(Duration::ZERO);
assert_eq!(value, Some(42));
```

## Async First, Blocking by Adaptation

Async and synchronous synchronization primitives have different optimization constraints. Once an async primitive is runtime-agnostic, synchronous code can usually drive its future with a `block_on` adapter.

Asyncband's blocking feature provides this adapter with a lightweight, thread-parking single-future executor. Pending work parks the calling thread and its waker resumes it, providing blocking interoperability without busy-waiting or a full async runtime.

## Execution Constraints

This is a minimal single-future executor, not a general-purpose async runtime. A timed-out `wait_timeout` drops the future. Futures depending on a runtime-specific timer or I/O driver may not make progress, and blocking an executor thread can cause starvation or deadlocks.

See the [blocking module documentation](https://github.com/apache/asyncband/blob/main/asyncband/src/blocking/mod.rs) for the complete constraints.

## Thread Safety

Asyncband primitives and guards implement `Send` and `Sync` only when the protected or transferred value satisfies the necessary bounds. See each type's documentation for its exact bounds.

## Minimum Supported Rust Version

The current minimum supported rustc version is **1.86.0**.

The minimum Rust version required to use the crate can be increased in minor version updates. Patch releases within the same minor line retain that line's minimum version.
