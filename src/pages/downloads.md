---
# Licensed to the Apache Software Foundation (ASF) under one or more contributor
# license agreements. See the NOTICE file distributed with this work for
# additional information regarding copyright ownership. The ASF licenses this
# file to you under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at https://www.apache.org/licenses/LICENSE-2.0.
title: Downloads
description: Apache Asyncband release downloads.
---

# Downloads

:::info First Apache release forthcoming

Apache Asyncband has not yet published an official Apache Software Foundation release. The first source release, its signature, checksum, and signing keys will be listed here after it is approved.

:::

## Releases

Apache Asyncband releases will be provided as source archives. Each release entry will include links to the archive, its detached OpenPGP signature (`.asc`), and its SHA-512 checksum (`.sha512`). Older releases will remain available from the [Apache archive](https://archive.apache.org/dist/).

Until the first release is published, the latest development source is available from the [Apache Asyncband repository](https://github.com/apache/asyncband). Git branches, tags, and packages obtained from other services are not official ASF releases.

## Verify a release

Every official release must be verified before use. Download the source archive and its matching `.asc` and `.sha512` files, together with the Apache Asyncband `KEYS` file linked from the release entry. Signatures and checksums should be downloaded from the official Apache distribution site, even when the source archive is served by a mirror.

Import the release signing keys and verify the detached signature:

```bash
gpg --import KEYS
gpg --verify apache-asyncband-<version>-src.tar.gz.asc apache-asyncband-<version>-src.tar.gz
```

Verify the SHA-512 checksum:

```bash
shasum -a 512 -c apache-asyncband-<version>-src.tar.gz.sha512
```

See [Verifying Apache Software Foundation Releases](https://www.apache.org/info/verification.html) for details about checking signatures, checksums, and signing-key fingerprints.
