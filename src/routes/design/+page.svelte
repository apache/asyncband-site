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
</script>

<svelte:head>
	<title>Design — Apache Asyncband™ (Incubating)</title>
	<meta
		name="description"
		content="Asyncband runtime, feature, blocking, thread-safety, and Rust-version model."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/design/" />
	<meta property="og:url" content="https://asyncband.apache.org/design/" />
	<meta property="og:title" content="Design — Apache Asyncband™ (Incubating)" />
	<meta
		property="og:description"
		content="Asyncband runtime, feature, blocking, thread-safety, and Rust-version model."
	/>
</svelte:head>

<main id="main-content">
	<header class="page-hero">
		<div class="container page-hero-inner">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				<a href={resolve('/')}>Home</a><span aria-hidden="true">/</span><span>Design</span>
			</nav>
			<p class="section-label">How the crate works</p>
			<h1>Runtime and compatibility model</h1>
			<p>
				Asyncband relies on standard futures and opt-in Cargo features. Blocking support remains a
				boundary adapter for synchronous callers.
			</p>
		</div>
	</header>

	<section class="document-section">
		<div class="container document-layout">
			<aside class="page-toc">
				<strong>On this page</strong>
				<nav aria-label="Page contents">
					<a href="#runtime">Runtime agnostic</a>
					<a href="#features">Opt-in APIs</a>
					<a href="#blocking">Blocking interoperability</a>
					<a href="#thread-safety">Thread safety</a>
					<a href="#rust-version">Rust version</a>
				</nav>
			</aside>

			<div class="document-content document-prose">
				<section id="runtime" aria-labelledby="runtime-heading">
					<p class="section-label">01 / Runtime</p>
					<h2 id="runtime-heading">Runtime agnostic</h2>
					<p>
						Asyncband APIs use standard futures and wakers. They can run on Tokio, async-std, smol,
						or a custom executor that polls standard Rust futures.
					</p>
					<ul class="fact-list">
						<li>The asynchronous primitives do not start threads.</li>
						<li>They do not spawn tasks.</li>
						<li>They do not require a runtime-specific reactor.</li>
					</ul>
					<a class="text-link" href="https://docs.rs/asyncband/">
						Read the crate-level documentation <span aria-hidden="true">↗</span>
					</a>
				</section>

				<section id="features" aria-labelledby="features-heading">
					<p class="section-label">02 / Features</p>
					<h2 id="features-heading">APIs are opt in</h2>
					<p>
						The crate exposes no optional modules by default. List every API your application uses
						in Cargo features.
					</p>
					<div class="snippet" aria-label="Asyncband installation command">
						<span>Shell</span>
						<code><i>$</i> cargo add asyncband --features mutex,oneshot</code>
					</div>
					<p>
						Categories in the project documentation describe each API's primary purpose. They do not
						add another module level to public paths.
					</p>
				</section>

				<section id="blocking" aria-labelledby="blocking-heading">
					<p class="section-label">03 / Interoperability</p>
					<h2 id="blocking-heading">Async first, blocking by adaptation</h2>
					<p>
						The optional <code>blocking</code> module provides a lightweight, thread-parking single-future
						executor. Pending work parks the calling thread, and the future's waker resumes it.
					</p>
					<div class="notice">
						<strong>Execution constraint</strong>
						<p>
							This adapter is not a general-purpose async runtime. Futures that depend on a
							runtime-specific timer or I/O driver may not make progress, and blocking an executor
							thread can cause starvation or deadlocks.
						</p>
					</div>
					<a
						class="text-link"
						href="https://github.com/apache/asyncband/blob/main/README.md#synchronous-interoperability"
					>
						Read the synchronous interoperability notes <span aria-hidden="true">↗</span>
					</a>
				</section>

				<section id="thread-safety" aria-labelledby="thread-safety-heading">
					<p class="section-label">04 / Safety bounds</p>
					<h2 id="thread-safety-heading">Thread safety follows the values</h2>
					<p>
						Asyncband primitives and guards implement <code>Send</code> and <code>Sync</code> only when
						the protected or transferred value satisfies the required bounds. Consult each type's API
						documentation for its exact contract.
					</p>
				</section>

				<section id="rust-version" aria-labelledby="rust-version-heading">
					<p class="section-label">05 / Compatibility</p>
					<h2 id="rust-version-heading">Minimum supported Rust version</h2>
					<p>
						The current MSRV is <strong>Rust 1.86.0</strong>. The project policy permits increasing
						the minimum Rust version in a minor release, while patch releases within the same minor
						line retain that line's minimum version.
					</p>
				</section>
			</div>
		</div>
	</section>
</main>
