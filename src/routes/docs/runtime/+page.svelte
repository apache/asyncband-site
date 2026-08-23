<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import DocsShell from '$lib/components/DocsShell.svelte';

	const blockingExample = `use std::time::Duration;

use asyncband::blocking::FutureExt as _;

let value = async { 42 }.block_on();
assert_eq!(value, 42);

let value = async { 42 }.wait_timeout(Duration::ZERO);
assert_eq!(value, Some(42));`;
</script>

<svelte:head>
	<title>Runtime and Blocking | Apache Asyncband</title>
	<meta
		name="description"
		content="Apache Asyncband runtime model, blocking interoperability, thread safety, and minimum Rust version."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/docs/runtime/" />
	<meta property="og:url" content="https://asyncband.apache.org/docs/runtime/" />
	<meta property="og:title" content="Runtime and Blocking | Apache Asyncband" />
</svelte:head>

<DocsShell label="Runtime and Blocking">
	{#snippet toc()}
		<ul>
			<li><a href="#runtime-agnostic">Runtime Agnostic</a></li>
			<li><a href="#synchronous-interoperability">Synchronous Interoperability</a></li>
			<li><a href="#async-first">Async First</a></li>
			<li><a href="#execution-constraints">Execution Constraints</a></li>
			<li><a href="#thread-safety">Thread Safety</a></li>
			<li><a href="#msrv">Minimum Supported Rust Version</a></li>
		</ul>
	{/snippet}

	<h1>Runtime and Blocking</h1>

	<h2 id="runtime-agnostic">Runtime Agnostic</h2>
	<p>
		All asynchronous APIs in this library are runtime-agnostic. They can be used with Tokio,
		async-std, smol, or a custom executor.
	</p>
	<p>
		The async primitives do not start threads, spawn tasks, or require a runtime-specific reactor.
		Await them inside any executor that polls standard Rust futures.
	</p>

	<h2 id="synchronous-interoperability">Synchronous Interoperability</h2>
	<p>
		The optional <code>blocking</code> module bridges synchronous Rust code to runtime-agnostic futures.
	</p>
	<pre><code>cargo add asyncband --features blocking</code></pre>
	<pre><code>{blockingExample}</code></pre>

	<h2 id="async-first">Async First, Blocking by Adaptation</h2>
	<p>
		Async and synchronous synchronization primitives have different optimization constraints. Once
		an async primitive is runtime-agnostic, synchronous code can usually drive its future with a <code
			>block_on</code
		> adapter.
	</p>
	<p>
		Asyncband's blocking feature provides this adapter with a lightweight, thread-parking
		single-future executor. Pending work parks the calling thread and its waker resumes it,
		providing blocking interoperability without busy-waiting or a full async runtime.
	</p>

	<h2 id="execution-constraints">Execution Constraints</h2>
	<p>
		This is a minimal single-future executor, not a general-purpose async runtime. A timed-out
		<code>wait_timeout</code> drops the future. Futures depending on a runtime-specific timer or I/O driver
		may not make progress, and blocking an executor thread can cause starvation or deadlocks.
	</p>
	<p>
		See the <a href="https://github.com/apache/asyncband/blob/main/asyncband/src/blocking/mod.rs"
			>blocking module documentation</a
		>
		for the complete constraints.
	</p>

	<h2 id="thread-safety">Thread Safety</h2>
	<p>
		Asyncband primitives and guards implement <code>Send</code> and <code>Sync</code> only when the protected
		or transferred value satisfies the necessary bounds. See each type's documentation for its exact bounds.
	</p>

	<h2 id="msrv">Minimum Supported Rust Version</h2>
	<p>The current minimum supported rustc version is <strong>1.86.0</strong>.</p>
	<p>
		The minimum Rust version required to use the crate can be increased in minor version updates.
		Patch releases within the same minor line retain that line's minimum version.
	</p>
</DocsShell>
