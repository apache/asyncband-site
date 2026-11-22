---
title: Community
description: How Apache Asyncband (Incubating) is governed and where to ask questions, discuss designs, report issues, and contribute.
hide_table_of_contents: true
---

# Community

Apache Asyncband (Incubating) is an effort undergoing incubation at the [Apache Software Foundation](https://www.apache.org/), sponsored by the [Apache Incubator PMC](https://incubator.apache.org/). Project governance, release votes, and design decisions happen in the open following the [Apache Way](https://www.apache.org/theapacheway/).

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

* Browse [`good first issue`](https://github.com/apache/asyncband/labels/good%20first%20issue) and [`help wanted`](https://github.com/apache/asyncband/labels/help%20wanted) tasks on GitHub to find self-contained starting points.
* Follow the repository workflow, Rust style, and documentation conventions in [`AGENTS.md`](https://github.com/apache/asyncband/blob/main/AGENTS.md) when preparing a pull request.
* Release managers follow the documented, repeatable [release procedure](https://github.com/apache/asyncband/blob/main/.agents/skills/release/SKILL.md) and [license audit checklist](https://github.com/apache/asyncband/blob/main/.agents/skills/license-audit/SKILL.md) to build and verify Apache source releases.

## Governance and decision-making

* **Project roster**: The public list of active PPMC members, committers, and mentors is maintained on the [Apache Phonebook](https://people.apache.org/phonebook.html?podling=asyncband) and [Whimsy PPMC roster](https://whimsy.apache.org/roster/ppmc/asyncband).
* **Written asynchronous discussion**: Substantive architecture, API contract, roadmap, release, and governance discussions happen in writing on `dev@asyncband.apache.org` or in public GitHub issues and pull requests. Any off-list or synchronous discussion that affects the project is summarized back to `dev@asyncband.apache.org` before a decision is finalized.
* **Consensus and voting**: Routine code and documentation changes proceed through pull request review and [lazy consensus](https://community.apache.org/committers/lazyConsensus.html). Software releases, committer and PPMC elections, and formal policy decisions follow standard [Apache voting rules](https://www.apache.org/foundation/voting.html) (`+1` / `0` / `-1`, open for at least 72 hours). Release votes require at least three binding `+1` votes and more `+1` than `-1` votes on `dev@asyncband.apache.org`, followed during incubation by approval from the Apache Incubator PMC on `general@incubator.apache.org`.
* **Vetoes**: Per Apache voting rules, vetoes (`-1`) apply only to code modifications and must be accompanied by a clear technical explanation.

## Roles and meritocracy

Apache Asyncband operates as a meritocracy in which contributors participate as individuals rather than representatives of an employer or organization:

* **Contributors**: Anyone who reports bugs, joins design discussions, reviews pull requests, writes documentation, or submits code.
* **Committers**: Contributors who demonstrate sustained, constructive engagement and good engineering judgment may be nominated by any PPMC member and elected by private PPMC vote following the [ASF Incubator PPMC guide](https://incubator.apache.org/guides/ppmc.html). Committers sign the [Apache Individual Contributor License Agreement (ICLA)](https://www.apache.org/licenses/contributor-agreements.html#clas), hold write access to project repositories, and help review contributions.
* **PPMC members**: Committers who take ongoing responsibility for project stewardship, release verification and voting, contributor mentorship, security response, and Incubator board reporting may be elected to the Podling Project Management Committee (PPMC).

## Security

Do not report suspected security vulnerabilities in public GitHub issues or mailing lists. Report them privately to [security@apache.org](mailto:security@apache.org) with `Asyncband` in the subject line, following the [ASF vulnerability reporting process](https://www.apache.org/security/). See [`SECURITY-THREAT-MODEL.md`](https://github.com/apache/asyncband/blob/main/SECURITY-THREAT-MODEL.md) in the main repository for scope details.
