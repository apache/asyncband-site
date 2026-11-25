---
title: Downloads
description: Official Apache source releases, PGP signatures, SHA-512 checksums, and crates.io convenience packages for Apache Asyncband™ (Incubating).
hide_table_of_contents: true
---

# Apache Asyncband™ (Incubating) Downloads

## Official Apache source releases

Apache Asyncband™ (Incubating) software provides composable, runtime-agnostic concurrency primitives for async Rust. Its official distribution channel is the source release published through the ASF distribution system. The project maintains the current release line with monotonic releases rather than backporting to older release branches.

The latest official release is **0.8.0**:

| Artifact       | Link                                                                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source archive | [apache-asyncband-0.8.0-incubating-src.tar.gz](https://www.apache.org/dyn/closer.lua/incubator/asyncband/0.8.0/apache-asyncband-0.8.0-incubating-src.tar.gz)      |
| PGP signature  | [apache-asyncband-0.8.0-incubating-src.tar.gz.asc](https://downloads.apache.org/incubator/asyncband/0.8.0/apache-asyncband-0.8.0-incubating-src.tar.gz.asc)       |
| SHA-512        | [apache-asyncband-0.8.0-incubating-src.tar.gz.sha512](https://downloads.apache.org/incubator/asyncband/0.8.0/apache-asyncband-0.8.0-incubating-src.tar.gz.sha512) |
| Signing keys   | [KEYS](https://downloads.apache.org/incubator/asyncband/KEYS)                                                                                                     |

### Verifying a release

Always verify the integrity of downloaded artifacts using the PGP signatures or SHA-512 checksums hosted on `downloads.apache.org`:

```bash
# Import the release managers' public keys once:
curl -O https://downloads.apache.org/incubator/asyncband/KEYS
gpg --import KEYS

# Verify the detached PGP signature and SHA-512 checksum:
gpg --verify apache-asyncband-0.8.0-incubating-src.tar.gz.asc apache-asyncband-0.8.0-incubating-src.tar.gz
sha512sum -c apache-asyncband-0.8.0-incubating-src.tar.gz.sha512
```

For full instructions, refer to the Apache guide on [verifying the integrity of Apache project releases](https://www.apache.org/info/verification.html).

## Rust convenience packages

For day-to-day Rust development, Apache Asyncband (Incubating) also publishes convenience packages to [crates.io](https://crates.io/crates/asyncband) built from the official source release. These packages supplement the official Apache source release rather than replacing it:

```bash
cargo add asyncband --features mutex
```

* Crate page: [`asyncband` on crates.io](https://crates.io/crates/asyncband)
* API documentation: [`docs.rs/asyncband`](https://docs.rs/asyncband/)
* Release notes: [GitHub releases](https://github.com/apache/asyncband/releases) and [`CHANGELOG.md`](https://github.com/apache/asyncband/blob/main/CHANGELOG.md)

## Historical releases

Older source releases remain permanently available from the [Apache archive](https://archive.apache.org/dist/incubator/asyncband/). Upgrade to the latest release unless you have a specific constraint.
