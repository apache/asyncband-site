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
	import { apiCategories } from '$lib/site';
</script>

<svelte:head>
	<title>Apache Asyncband™ (Incubating) — Async synchronization for Rust</title>
	<meta
		name="description"
		content="Runtime-agnostic synchronization and coordination tools for asynchronous Rust."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/" />
	<meta property="og:url" content="https://asyncband.apache.org/" />
	<meta property="og:title" content="Apache Asyncband™ (Incubating)" />
	<meta
		property="og:description"
		content="Runtime-agnostic synchronization and coordination tools for asynchronous Rust."
	/>
</svelte:head>

<main id="main-content">
	<section class="hero">
		<div class="container hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">Apache Asyncband<sup>™</sup> (Incubating)</p>
				<h1>Runtime-agnostic synchronization for async Rust.</h1>
				<p class="hero-summary">
					Locks, initialization tools, task coordination, channels, object pools, and workload
					controls without tying an application to a particular async runtime.
				</p>

				<div class="button-row">
					<a class="button button-primary" href={resolve('/primitives/')}>Browse the primitives</a>
					<a class="button button-secondary" href="https://docs.rs/asyncband/">
						API documentation <span aria-hidden="true">↗</span>
					</a>
				</div>

				<ul class="project-facts" aria-label="Project facts">
					<li><strong>No default features</strong><span>Enable only the APIs you use</span></li>
					<li><strong>Rust 1.86+</strong><span>Minimum supported version</span></li>
					<li><strong>Apache 2.0</strong><span>Open source license</span></li>
				</ul>
			</div>

			<div class="code-card" aria-label="Asyncband mutex example">
				<div class="code-card-header">
					<span>Get started</span>
					<a href="https://crates.io/crates/asyncband"
						>crates.io <span aria-hidden="true">↗</span></a
					>
				</div>
				<div class="install-command">
					<code><span>$</span> cargo add asyncband --features mutex</code>
				</div>
				<pre><code
						><span class="syntax-keyword">use</span> asyncband::mutex::Mutex;

<span class="syntax-keyword">let</span> counter = Mutex::new(<span class="syntax-number">0</span>);
&#123;
    <span class="syntax-keyword">let mut</span> value = counter.lock().await;
    *value += <span class="syntax-number">1</span>;
&#125;

assert_eq!(*counter.lock().await, <span class="syntax-number">1</span>);</code
					></pre>
				<p class="code-note">
					The same API works with any executor that polls standard Rust futures.
				</p>
			</div>
		</div>
	</section>

	<section class="status-strip" aria-label="Incubation status">
		<div class="container status-strip-inner">
			<p><strong>Apache Incubator</strong> Asyncband entered incubation on August 19, 2026.</p>
			<a href="https://incubator.apache.org/projects/asyncband.html">
				Project status <span aria-hidden="true">↗</span>
			</a>
		</div>
	</section>

	<section class="page-section" aria-labelledby="api-heading">
		<div class="container">
			<div class="section-heading">
				<div>
					<p class="section-label">Available APIs</p>
					<h2 id="api-heading">Pick the modules your program needs.</h2>
				</div>
				<div>
					<p>
						No APIs are enabled by default. Cargo features expose primitives directly at concise
						public paths such as <code>asyncband::mutex</code> and
						<code>asyncband::once::OnceCell</code>.
					</p>
					<a class="text-link" href={resolve('/primitives/')}>See every API and feature →</a>
				</div>
			</div>

			<div class="api-grid">
				{#each apiCategories as category (category.name)}
					<article>
						<h3>{category.name}</h3>
						<p>{category.description}</p>
						<ul aria-label={`${category.name} APIs`}>
							{#each category.apis as api (api)}
								<li><code>{api}</code></li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section class="page-section resource-section" aria-labelledby="resource-heading">
		<div class="container resource-layout">
			<div>
				<p class="section-label">Project resources</p>
				<h2 id="resource-heading">Read, use, and contribute.</h2>
			</div>
			<div class="resource-list">
				<a href="https://docs.rs/asyncband/">
					<span
						><strong>API documentation</strong><small>Public types, functions, and contracts</small
						></span
					>
					<span aria-hidden="true">↗</span>
				</a>
				<a href="https://crates.io/crates/asyncband">
					<span
						><strong>asyncband on crates.io</strong><small>Published crate and versions</small
						></span
					>
					<span aria-hidden="true">↗</span>
				</a>
				<a href="https://github.com/apache/asyncband">
					<span
						><strong>Source repository</strong><small>Code, issues, and contribution history</small
						></span
					>
					<span aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
	</section>
</main>
