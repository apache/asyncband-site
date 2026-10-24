---
title: "Coalescing Concurrent Work with Singleflight"
description: "Use Asyncband's singleflight Group to let overlapping calls share one execution, handle errors and cancellation, and choose between the group and the once family by whether results are retained."
authors: [nanami]
tags: [singleflight, once]
---

Concurrent callers sometimes need the same expensive result at the same time: a short-lived credential that several requests must refresh, a remote directory that several operations need to exist, or a report that several queries want built. Running the work once per caller multiplies load on whatever produces the result, and every caller waits for its own duplicate execution.

Asyncband's [`singleflight::Group`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html) coalesces these calls: while work for a key is in flight, later callers for that key wait and receive a clone of its value. This post covers sharing one execution, what happens when the shared execution fails or is cancelled, and how to choose between a group and the once family, whose members retain completed state.

<!-- truncate -->

_The Asyncband APIs below are from version 0.7.3, with the `singleflight`, `once-cell`, `once-map`, `lazy-cell`, and `once` features enabled._

## Share one execution per key

A group coalesces by key. [`work`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html#method.work) takes a key and an async function; while the function for that key is running, later calls with the same key wait for its result instead of starting their own:

```rust
use asyncband::singleflight::Group;

struct Credentials {
    refreshes: Group<&'static str, String>,
}

impl Credentials {
    async fn token(&self) -> String {
        self.refreshes
            .work("token", || async {
                // one round trip to the issuer, no matter how many callers overlap
                issue_token().await
            })
            .await
    }
}
```

Three callers that overlap run `issue_token` once. The first executes the function; the other two wait and each receive a clone of its value, so the value type must be `Clone`. Share an `Arc<T>` when the value is large or cloned often.

Keys are independent: calls with different keys never share an execution. A group does not limit overall concurrency; it collapses duplicate executions for the same key.

## No cache after completion

When the function completes successfully, the group removes the key. A call that starts after the previous one finished executes its own function again. For the token sample this means that calls which do not overlap each issue a token. A real refresh path caches the token until near expiry and enters the group only on a cache miss; the group itself holds no value over for later calls.

When later callers should reuse a completed result, either compose the group with a cache of your own or use the once family below. The two production users at the end of this post both compose: the group collapses overlapping calls, and a separate cache retains the result for later callers.

## Errors, cancellation, and retries

`work` takes a function that produces a value, with no channel for failure. Use [`try_work`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html#method.try_work) when the function can fail: it takes a function returning `Result<V, E>` and returns `Result<V, E>` to the caller.

A failure is returned to the caller that executed it, not shared with callers that joined. After an error, or after the active call is cancelled or its function panics, a waiting caller runs its own function instead of observing the failure. The same key can therefore execute more than once while attempts fail.

The function must not call `work` or `try_work` for its own key: it would wait for its own result. Calls for other keys proceed independently.

[`forget`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html#method.forget) detaches a key's in-flight execution. Calls that already joined it keep their result; later callers start a fresh execution even while the old one is still running. Use it when an in-flight call is taking too long and newer callers should not queue behind it.

## Choosing between a group and the once family

Asyncband's once family retains completed state; a group does not. The members differ in what they retain:

| Asyncband API                                                                                     | After completion                                   | Use                                                                                             |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`singleflight::Group`](https://docs.rs/asyncband/0.7.3/asyncband/singleflight/struct.Group.html) | The key is removed; a later call executes again.   | Overlapping calls for a key share one execution.                                                |
| [`OnceMap`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html)                   | The value is retained until `remove` or `discard`. | Compute once per key and cache the result.                                                      |
| [`OnceCell`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceCell.html)                 | The value is retained.                             | Store one value from an initializer supplied at access time.                                    |
| [`LazyCell`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.LazyCell.html)                 | The value is retained.                             | Initialize one value with a stored function; the in-flight future survives caller cancellation. |
| [`Once`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.Once.html)                         | No value is stored.                                | Run a side effect once, without storing a value.                                                |

[`OnceMap`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html) is the retained counterpart of a group. Its [`compute`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html#method.compute) runs the function once per key and serves every later caller a clone of the stored value, until [`remove`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html#method.remove) or [`discard`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html#method.discard) drops the entry, after which the next call computes again. [`try_compute`](https://docs.rs/asyncband/0.7.3/asyncband/once/struct.OnceMap.html#method.try_compute) takes a `Result`-returning function, mirroring `try_work` on a group. Every successful lookup returns an owned clone of the value, so prefer `Arc<T>` entries when values are large or frequently shared.

Failed, cancelled, or panicked attempts leave `OnceCell` and `OnceMap` entries available for another attempt. `Once` has no failure channel, and a cancelled or panicked run is abandoned the same way: a later call runs again. `LazyCell` instead preserves the same in-flight future across caller cancellation, and a panic poisons the cell rather than starting another attempt.

## In production

reqsign signs Azure Storage requests with [user delegation keys](https://github.com/apache/reqsign/blob/92dd0187ba788bca2e380bce95c469c2b2557241/services/azure-storage/src/user_delegation_sas.rs#L770-L796). The keys expire, so a burst of signing requests can simultaneously find the cached key missing. reqsign keeps one group for these requests; a cache miss calls `try_work` with a key covering the cache entry and its validity window, so overlapping misses issue one request to Azure. The function re-checks the cache before requesting — an overlapping request with a different validity window may have stored a usable key after this caller's miss, before its own execution started — and the fetched key is stored in the cache, not in the group, for later callers. A failed request returns its error to its caller, and a caller that joined the same flight retries the request itself. The cache write happens [after `try_work` returns](https://github.com/apache/reqsign/blob/92dd0187ba788bca2e380bce95c469c2b2557241/services/azure-storage/src/user_delegation_sas.rs#L842-L845). A caller arriving in that gap misses both the flight and the cache; its function's re-check only helps if the write lands before that function starts, and otherwise a second request goes out.

OpenDAL's Google Drive backend [creates directories on demand](https://github.com/apache/opendal/blob/9addb73a93f48a2dacd3ceed922ead98f28d0ed3/core/services/gdrive/src/path_index.rs#L288-L306). Concurrent operations on the same path would otherwise each query or create the same directory. The backend keys a group by the parent directory's id and the new directory's name, so concurrent ensure operations share one query or create. The resolved id is inserted into the path index before the shared execution completes, so a caller that arrives just after the flight reads the index instead of starting new work. That ordering is the alternative to an after-return write: publishing inside the flight means that on success there is no moment where the flight is gone and the index is still empty.

For work that overlapping callers can share, a group collapses the duplicates and retains nothing. Combine it with a cache when later callers should reuse the result, or choose the once family when retention is the primary need.
