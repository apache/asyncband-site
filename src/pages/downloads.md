---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
title: Downloads
description: Apache Asyncband (Incubating) release downloads.
---

# Apache Asyncband (Incubating) downloads

## Releases

Apache Asyncband (Incubating) releases are provided as source archives. The latest release is **0.7.2**, the first Apache Incubator release.

| Version | Source archive | Signature | Checksum |
| --- | --- | --- | --- |
| 0.7.2 | [apache-asyncband-0.7.2-incubating-src.tar.gz](https://www.apache.org/dyn/closer.lua/incubator/asyncband/apache-asyncband-0.7.2-incubating-src.tar.gz) | [ASC](https://downloads.apache.org/incubator/asyncband/apache-asyncband-0.7.2-incubating-src.tar.gz.asc) | [SHA-512](https://downloads.apache.org/incubator/asyncband/apache-asyncband-0.7.2-incubating-src.tar.gz.sha512) |

Older releases are available from the [Apache archive](https://archive.apache.org/dist/incubator/asyncband/).

The latest development source is available from the [Apache Asyncband repository](https://github.com/apache/asyncband). Git branches, tags, and packages obtained from other services are not Apache Asyncband (Incubating) releases.

## Verify a release

Every Apache Asyncband (Incubating) release must be verified before use. Download the source archive and its matching `.asc` and `.sha512` files, together with the project's [KEYS](https://downloads.apache.org/incubator/asyncband/KEYS) file, which contains the public keys used to sign releases. Signatures, checksums, and keys should be downloaded from the official Apache distribution site, even when the source archive is served by a mirror.

Import the release signing keys and verify the detached signature:

```bash
gpg --import KEYS
gpg --verify apache-asyncband-0.7.2-incubating-src.tar.gz.asc apache-asyncband-0.7.2-incubating-src.tar.gz
```

Verify the SHA-512 checksum:

```bash
shasum -a 512 -c apache-asyncband-0.7.2-incubating-src.tar.gz.sha512
```

See [Verifying Apache Software Foundation Releases](https://www.apache.org/info/verification.html) for details about checking signatures, checksums, and signing-key fingerprints.
