<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsShell from '$lib/components/DocsShell.svelte';

	const mutexExample = `use asyncband::mutex::Mutex;

let counter = Mutex::new(0);
{
    let mut value = counter.lock().await;
    *value += 1;
}

assert_eq!(*counter.lock().await, 1);`;
</script>

<svelte:head>
	<title>Getting Started | Apache Asyncband</title>
	<meta
		name="description"
		content="Install Apache Asyncband, select Cargo features, and use an asynchronous primitive."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/docs/getting-started/" />
	<meta property="og:url" content="https://asyncband.apache.org/docs/getting-started/" />
	<meta property="og:title" content="Getting Started | Apache Asyncband" />
</svelte:head>

<DocsShell label="Getting Started">
	{#snippet toc()}
		<ul>
			<li><a href="#installation">Installation</a></li>
			<li><a href="#using-a-primitive">Using a Primitive</a></li>
			<li><a href="#selecting-features">Selecting Features</a></li>
			<li><a href="#api-documentation">API Documentation</a></li>
		</ul>
	{/snippet}

	<h1>Getting Started</h1>

	<h2 id="installation">Installation</h2>
	<p>Add Asyncband to the project and explicitly enable the APIs it uses.</p>
	<pre><code>cargo add asyncband --features mutex,oneshot</code></pre>
	<p>
		No APIs are enabled by default. A bare <code>cargo add asyncband</code> intentionally exposes no optional
		modules.
	</p>

	<h2 id="using-a-primitive">Using a Primitive</h2>
	<p>After enabling a feature, use its module directly.</p>
	<pre><code>{mutexExample}</code></pre>

	<h2 id="selecting-features">Selecting Features</h2>
	<p>
		List every API the application uses in <code>features</code>. Categories describe each API's
		primary purpose and do not add another module level, so public paths remain concise.
	</p>
	<p><a href={resolve('/docs/primitives/')}>See the complete API and feature table.</a></p>

	<h2 id="api-documentation">API Documentation</h2>
	<p>
		The generated Rust API documentation is published at
		<a href="https://docs.rs/asyncband/">docs.rs/asyncband</a>.
	</p>
</DocsShell>
