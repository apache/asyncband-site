<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at

     https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsShell from '$lib/components/DocsShell.svelte';
</script>

<svelte:head>
	<title>Welcome to Apache Asyncband | Apache Asyncband</title>
	<meta
		name="description"
		content="Apache Asyncband is a runtime-agnostic library providing synchronization and coordination tools for asynchronous Rust programming."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/docs/about/" />
	<meta property="og:url" content="https://asyncband.apache.org/docs/about/" />
	<meta property="og:title" content="Welcome to Apache Asyncband (Incubating)" />
	<meta
		property="og:description"
		content="Runtime-agnostic synchronization and coordination tools for asynchronous Rust."
	/>
</svelte:head>

<DocsShell label="About">
	{#snippet toc()}
		<ul>
			<li><a href="#what-is-asyncband">What is Asyncband?</a></li>
			<li><a href="#installation">Installation</a></li>
			<li><a href="#getting-started">Getting Started</a></li>
			<li><a href="#available-apis">Available APIs</a></li>
		</ul>
	{/snippet}

	<h1>Welcome to Apache Asyncband (Incubating)</h1>

	<h2 id="what-is-asyncband">What is Asyncband?</h2>
	<p>
		Apache Asyncband is a runtime-agnostic library providing synchronization and coordination tools
		for asynchronous Rust programming. Its APIs work with any async runtime.
	</p>

	<h2 id="installation">Installation</h2>
	<p>Add the dependency to your project and list every API that the application uses.</p>
	<pre><code>cargo add asyncband --features mutex,oneshot</code></pre>
	<p>
		The crate enables no APIs by default. A bare <code>cargo add asyncband</code> intentionally exposes
		no optional modules.
	</p>

	<h2 id="getting-started">Getting Started</h2>
	<p>
		See <a href={resolve('/docs/getting-started/')}>Getting Started</a> for installation and a
		minimal example. The <a href="https://docs.rs/asyncband/">API documentation</a> contains public types,
		functions, and their exact contracts.
	</p>

	<h2 id="available-apis">Available APIs</h2>
	<p>Categories describe each API's primary purpose and do not add another module level.</p>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr><th>Use case</th><th>APIs</th><th>Cargo features</th></tr>
			</thead>
			<tbody>
				<tr
					><td>Protect shared state</td><td>Mutex, RwLock, Condvar</td><td
						><code>mutex</code>, <code>rwlock</code>, <code>condvar</code></td
					></tr
				>
				<tr
					><td>Initialize values once</td><td>Once, OnceCell, OnceMap</td><td
						><code>once</code>, <code>once-cell</code>, <code>once-map</code></td
					></tr
				>
				<tr
					><td>Coordinate tasks</td><td>Barrier, Latch, WaitGroup, shutdown</td><td
						><code>barrier</code>, <code>latch</code>, <code>waitgroup</code>,
						<code>shutdown</code></td
					></tr
				>
				<tr
					><td>Send values</td><td>oneshot, bounded and unbounded mpsc</td><td
						><code>oneshot</code>, <code>mpsc</code></td
					></tr
				>
				<tr
					><td>Reuse managed objects</td><td>bounded and unbounded pools</td><td
						><code>pool</code></td
					></tr
				>
				<tr
					><td>Control workloads</td><td>Semaphore, singleflight Group</td><td
						><code>semaphore</code>, <code>singleflight</code></td
					></tr
				>
				<tr
					><td>Wait from synchronous code</td><td>blocking::FutureExt</td><td
						><code>blocking</code></td
					></tr
				>
			</tbody>
		</table>
	</div>
</DocsShell>
