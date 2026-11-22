---
title: Community
description: How Apache Asyncband (Incubating) is governed and where to ask questions, discuss designs, report issues, and contribute.
hide_table_of_contents: true
---

# Community

Apache Asyncband (Incubating) is an effort undergoing incubation at the [Apache Software Foundation](https://www.apache.org/), sponsored by the [Apache Incubator PMC](https://incubator.apache.org/). Project governance, release votes, and design decisions happen in the open following the [Apache Way](https://www.apache.org/theapacheway/). For a point-in-time evaluation against the Apache Project Maturity Model, see the [Community Report & Maturity Assessment](/community/maturity/).

## Mailing lists

Mailing lists are the primary record for project decisions and release votes:

| List                           | Purpose                                          | Subscribe                                                  | Archives                                                                    |
| ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `dev@asyncband.apache.org`     | Design discussions, proposals, and release votes | [Subscribe](mailto:dev-subscribe@asyncband.apache.org)     | [Archives](https://lists.apache.org/list.html?dev@asyncband.apache.org)     |
| `commits@asyncband.apache.org` | Automated notifications for commits, issues, PRs | [Subscribe](mailto:commits-subscribe@asyncband.apache.org) | [Archives](https://lists.apache.org/list.html?commits@asyncband.apache.org) |

To unsubscribe from either list, send an email to `dev-unsubscribe@asyncband.apache.org` or `commits-unsubscribe@asyncband.apache.org`.

## GitHub

* [GitHub Issues](https://github.com/apache/asyncband/issues): Bug reports and concrete feature requests.
* [GitHub Discussions](https://github.com/apache/asyncband/discussions): Usage questions, concurrency trade-off discussions, and early design ideas.
* [`apache/asyncband`](https://github.com/apache/asyncband): Core Rust crate, runnable [`examples`](https://github.com/apache/asyncband/tree/main/examples), and [`benchmarks`](https://github.com/apache/asyncband/tree/main/benchmarks).
* [`apache/asyncband-site`](https://github.com/apache/asyncband-site): Source repository for this website and engineering blog.

## Contributing

Contributions of all kinds are welcome, including bug reports, benchmark cases, documentation improvements, code reviews, and primitive implementations. When proposing a new concurrency primitive, evaluate it against Asyncband's core boundary: reusable coordination mechanisms belong in the library, while task spawning, timers, retries, and runtime scheduling policy remain with the caller.

## Security

Do not report suspected security vulnerabilities in public GitHub issues or mailing lists. Report them privately to [security@apache.org](mailto:security@apache.org) with `Asyncband` in the subject line, following the [ASF vulnerability reporting process](https://www.apache.org/security/). See [`SECURITY-THREAT-MODEL.md`](https://github.com/apache/asyncband/blob/main/SECURITY-THREAT-MODEL.md) in the main repository for scope details.
