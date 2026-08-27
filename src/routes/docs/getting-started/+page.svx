---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
label: Getting Started
title: Getting Started | Apache Asyncband
description: Install Apache Asyncband, select Cargo features, and use an asynchronous primitive.
canonical: https://asyncband.apache.org/docs/getting-started/
---

# Getting Started

## Installation

Add Asyncband to the project and explicitly enable the APIs it uses.

```bash
cargo add asyncband --features mutex,oneshot
```

No APIs are enabled by default. A bare `cargo add asyncband` intentionally exposes no optional modules.

## Using a Primitive

After enabling a feature, use its module directly.

```rust
use asyncband::mutex::Mutex;

let counter = Mutex::new(0);
{
    let mut value = counter.lock().await;
    *value += 1;
}

assert_eq!(*counter.lock().await, 1);
```

## Selecting Features

List every API the application uses in `features`. Categories describe each API's primary purpose and do not add another module level, so public paths remain concise.

[See the complete API and feature table.](/docs/primitives/)

## API Documentation

The generated Rust API documentation is published at [docs.rs/asyncband](https://docs.rs/asyncband/).
