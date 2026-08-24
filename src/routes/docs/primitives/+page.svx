---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
label: Primitives
title: Available APIs | Apache Asyncband
description: Apache Asyncband primitives, Cargo features, public paths, and purposes.
canonical: https://asyncband.apache.org/docs/primitives/
---

# Available APIs

The crate enables no APIs by default. Categories describe each API's primary purpose and do not add another module level.

## Shared state

| API | Feature | Purpose |
| --- | --- | --- |
| [Mutex](https://docs.rs/asyncband/latest/asyncband/mutex/struct.Mutex.html)<br />`asyncband::mutex::Mutex` | `mutex` | Protect shared data with asynchronous mutual exclusion. |
| [RwLock](https://docs.rs/asyncband/latest/asyncband/rwlock/struct.RwLock.html)<br />`asyncband::rwlock::RwLock` | `rwlock` | Allow multiple readers or one writer. |
| [Condvar](https://docs.rs/asyncband/latest/asyncband/condvar/struct.Condvar.html)<br />`asyncband::condvar::Condvar` | `condvar` | Wait for notifications while releasing a mutex. |

## One-time initialization

| API | Feature | Purpose |
| --- | --- | --- |
| [Once](https://docs.rs/asyncband/latest/asyncband/once/struct.Once.html)<br />`asyncband::once::Once` | `once` | Run asynchronous initialization exactly once. |
| [OnceCell](https://docs.rs/asyncband/latest/asyncband/once/struct.OnceCell.html)<br />`asyncband::once::OnceCell` | `once-cell` | Initialize and store one asynchronous value. |
| [OnceMap](https://docs.rs/asyncband/latest/asyncband/once/struct.OnceMap.html)<br />`asyncband::once::OnceMap` | `once-map` | Initialize and store one value per key. |

## Task coordination

| API | Feature | Purpose |
| --- | --- | --- |
| [Barrier](https://docs.rs/asyncband/latest/asyncband/barrier/struct.Barrier.html)<br />`asyncband::barrier::Barrier` | `barrier` | Wait until all participants reach a synchronization point. |
| [Latch](https://docs.rs/asyncband/latest/asyncband/latch/struct.Latch.html)<br />`asyncband::latch::Latch` | `latch` | Wait until a one-way countdown completes. |
| [WaitGroup](https://docs.rs/asyncband/latest/asyncband/waitgroup/struct.WaitGroup.html)<br />`asyncband::waitgroup::WaitGroup` | `waitgroup` | Wait for a dynamic group of tasks to finish. |
| [shutdown](https://docs.rs/asyncband/latest/asyncband/shutdown/index.html)<br />`asyncband::shutdown` | `shutdown` | Coordinate shutdown signals and completion. |

## Channels

| API | Feature | Purpose |
| --- | --- | --- |
| [oneshot::channel](https://docs.rs/asyncband/latest/asyncband/oneshot/fn.channel.html)<br />`asyncband::oneshot::channel` | `oneshot` | Send one value between two tasks. |
| [mpsc::bounded](https://docs.rs/asyncband/latest/asyncband/mpsc/fn.bounded.html)<br />`asyncband::mpsc::bounded` | `mpsc` | Send values from multiple producers through a bounded channel. |
| [mpsc::unbounded](https://docs.rs/asyncband/latest/asyncband/mpsc/fn.unbounded.html)<br />`asyncband::mpsc::unbounded` | `mpsc` | Send values from multiple producers through an unbounded channel. |

## Resource reuse

| API | Feature | Purpose |
| --- | --- | --- |
| [pool::bounded](https://github.com/apache/asyncband/blob/main/asyncband/src/pool/bounded.rs)<br />`asyncband::pool::bounded` | `pool` | Reuse managed objects up to a configured capacity. |
| [pool::unbounded](https://github.com/apache/asyncband/blob/main/asyncband/src/pool/unbounded.rs)<br />`asyncband::pool::unbounded` | `pool` | Reuse manually supplied or manager-created objects. |

## Workload control

| API | Feature | Purpose |
| --- | --- | --- |
| [Semaphore](https://docs.rs/asyncband/latest/asyncband/semaphore/struct.Semaphore.html)<br />`asyncband::semaphore::Semaphore` | `semaphore` | Control concurrent access with permits. |
| [singleflight::Group](https://docs.rs/asyncband/latest/asyncband/singleflight/struct.Group.html)<br />`asyncband::singleflight::Group` | `singleflight` | Coalesce concurrent calls for the same key. |

## Blocking Interoperability

The optional `blocking` module bridges synchronous Rust code to runtime-agnostic futures. It is an interoperability utility rather than another async primitive, so it is documented separately from the tables above.

```bash
cargo add asyncband --features blocking
```

See [Runtime and Blocking](/docs/runtime/#synchronous-interoperability) for the execution model and constraints.
