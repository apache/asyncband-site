---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
label: About
title: Welcome to Apache Asyncband | Apache Asyncband
description: Apache Asyncband is a runtime-agnostic library providing synchronization and coordination tools for asynchronous Rust programming.
canonical: https://asyncband.apache.org/docs/about/
ogTitle: Welcome to Apache Asyncband (Incubating)
---

# Welcome to Apache Asyncband (Incubating)

## What is Asyncband?

Apache Asyncband is a runtime-agnostic library providing synchronization and coordination tools for asynchronous Rust programming. Its APIs work with any async runtime.

## Installation

Add the dependency to your project and list every API that the application uses.

```bash
cargo add asyncband --features mutex,oneshot
```

The crate enables no APIs by default. A bare `cargo add asyncband` intentionally exposes no optional modules.

## Getting Started

See [Getting Started](/docs/getting-started/) for installation and a minimal example. The [API documentation](https://docs.rs/asyncband/) contains public types, functions, and their exact contracts.

## Available APIs

Categories describe each API's primary purpose and do not add another module level.

| Use case | APIs | Cargo features |
| --- | --- | --- |
| Protect shared state | Mutex, RwLock, Condvar | `mutex`, `rwlock`, `condvar` |
| Initialize values once | Once, OnceCell, OnceMap | `once`, `once-cell`, `once-map` |
| Coordinate tasks | Barrier, Latch, WaitGroup, shutdown | `barrier`, `latch`, `waitgroup`, `shutdown` |
| Send values | oneshot, bounded and unbounded mpsc | `oneshot`, `mpsc` |
| Reuse managed objects | bounded and unbounded pools | `pool` |
| Control workloads | Semaphore, singleflight Group | `semaphore`, `singleflight` |
| Wait from synchronous code | blocking::FutureExt | `blocking` |
