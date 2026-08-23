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

	const primitiveGroups = [
		{
			index: '01',
			name: 'Shared state',
			description: 'Coordinate access and initialize values exactly once.',
			items: ['Mutex', 'RwLock', 'Condvar', 'Once', 'OnceCell', 'OnceMap']
		},
		{
			index: '02',
			name: 'Task coordination',
			description: 'Make progress visible across independently scheduled tasks.',
			items: ['Barrier', 'Latch', 'WaitGroup', 'shutdown']
		},
		{
			index: '03',
			name: 'Channels',
			description: 'Move values with explicit capacity and delivery semantics.',
			items: ['oneshot', 'bounded mpsc', 'unbounded mpsc', 'broadcast']
		},
		{
			index: '04',
			name: 'Workload control',
			description: 'Bound concurrency and coalesce duplicate work.',
			items: ['Semaphore', 'singleflight Group']
		}
	];

	const principles = [
		{
			name: 'Runtime neutral',
			body: 'The primitives depend on futures, not on a particular executor. Bring the runtime that fits your application.'
		},
		{
			name: 'Explicit surface',
			body: 'No primitive is enabled by default. Feature flags keep dependencies and public APIs intentional.'
		},
		{
			name: 'Honest safety bounds',
			body: 'Send and Sync implementations follow the values a primitive protects, stores, or transfers.'
		},
		{
			name: 'Async first',
			body: 'Blocking support stays at the boundary as an adapter instead of duplicating every asynchronous API.'
		}
	];

	const useCases = [
		['Bounded pipelines', 'Keep producers from outrunning the work a system can safely absorb.'],
		[
			'Coordinated lifecycle',
			'Wait for startup, fan-in completion, and graceful shutdown without runtime coupling.'
		],
		[
			'Shared initialization',
			'Construct expensive state once and let concurrent callers await the same result.'
		],
		[
			'Duplicate suppression',
			'Collapse concurrent requests for the same key into one in-flight operation.'
		]
	];
</script>

<svelte:head>
	<title>Apache Asyncband™ (Incubating) — Async synchronization for Rust</title>
	<meta
		name="description"
		content="Apache Asyncband is a runtime-agnostic Rust library of synchronization and coordination primitives for asynchronous programs."
	/>
	<meta name="theme-color" content="#121512" />
	<link rel="canonical" href="https://asyncband.apache.org/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://asyncband.apache.org/" />
	<meta property="og:title" content="Apache Asyncband™ (Incubating)" />
	<meta
		property="og:description"
		content="Runtime-agnostic synchronization and coordination primitives for asynchronous Rust."
	/>
	<meta property="og:image" content="https://asyncband.apache.org/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Apache Asyncband — Synchronize work. Not runtimes. — Incubating"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://asyncband.apache.org/og.png" />
	<meta
		name="twitter:image:alt"
		content="Apache Asyncband — Synchronize work. Not runtimes. — Incubating"
	/>
</svelte:head>

<a class="skip-link" href="#content">Skip to content</a>

<div class="site-shell">
	<header class="site-header">
		<a class="brand" href={resolve('/')} aria-label="Apache Asyncband home">
			<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
			<span>Apache Asyncband<sup>™</sup></span>
			<small>Incubating</small>
		</a>

		<nav aria-label="Primary navigation">
			<a href="#primitives">Primitives</a>
			<a href="#principles">Principles</a>
			<a href="#uses">Use cases</a>
		</nav>

		<a class="header-link" href="https://docs.rs/asyncband/">API docs <span>↗</span></a>
	</header>

	<main id="content">
		<section class="hero" aria-labelledby="hero-title">
			<div class="hero-copy">
				<p class="eyebrow"><span></span> Async coordination for Rust</p>
				<h1 id="hero-title">Synchronize work.<br /><em>Not runtimes.</em></h1>
				<p class="hero-summary">
					Apache Asyncband software is a runtime-agnostic library of synchronization and
					coordination primitives for asynchronous Rust programs.
				</p>

				<div class="hero-actions">
					<a class="button button-primary" href="#primitives"
						>Explore the primitives <span>↓</span></a
					>
					<a class="button button-secondary" href="https://github.com/apache/asyncband"
						>View source <span>↗</span></a
					>
				</div>

				<ul class="hero-facts" aria-label="Project characteristics">
					<li><span>01</span> Runtime agnostic</li>
					<li><span>02</span> Feature gated</li>
					<li><span>03</span> Async first</li>
				</ul>
			</div>

			<div class="code-panel" aria-label="Asyncband semaphore example">
				<div class="code-panel-header">
					<span>semaphore.rs</span>
					<span class="code-status"><i></i> runtime neutral</span>
				</div>
				<pre><code
						><span class="code-keyword">use</span> asyncband::semaphore::Semaphore;

<span class="code-keyword">let</span> gate = Semaphore::new(<span class="code-number">3</span>);

<span class="code-comment">// Capacity returns when the permit drops.</span>
<span class="code-keyword">let</span> permit = gate.acquire(<span class="code-number">1</span
						>).await;
do_work().await;
drop(permit);</code
					></pre>
				<div class="code-command">
					<span>$</span>
					<code>cargo add asyncband --features semaphore</code>
				</div>
			</div>
		</section>

		<aside class="incubation-note" aria-labelledby="incubation-title">
			<div class="incubation-label">
				<span>ASF</span>
				<strong id="incubation-title">Incubation notice</strong>
			</div>
			<p>
				Apache Asyncband (Incubating) is an effort undergoing incubation at the Apache Software
				Foundation (ASF), sponsored by the Apache Incubator PMC. Incubation is required of all newly
				accepted projects until a further review indicates that the infrastructure, communications,
				and decision making process have stabilized in a manner consistent with other successful ASF
				projects. While incubation status is not necessarily a reflection of the completeness or
				stability of the code, it does indicate that the project has yet to be fully endorsed by the
				ASF.
			</p>
			<a href="https://incubator.apache.org/projects/asyncband.html"
				>Project status <span>↗</span></a
			>
		</aside>

		<section class="section primitives" id="primitives" aria-labelledby="primitives-title">
			<div class="section-heading">
				<p class="eyebrow"><span></span> The taxonomy</p>
				<h2 id="primitives-title">One vocabulary.<br />Four kinds of work.</h2>
				<p>
					Pick only the modules your program needs. Each category describes the job a primitive
					performs, without adding another level to its public path.
				</p>
			</div>

			<div class="primitive-grid">
				{#each primitiveGroups as group (group.name)}
					<article class="primitive-card">
						<div class="card-index">{group.index}</div>
						<h3>{group.name}</h3>
						<p>{group.description}</p>
						<ul>
							{#each group.items as item (item)}
								<li>{item}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</section>

		<section class="section principles" id="principles" aria-labelledby="principles-title">
			<div class="section-heading compact">
				<p class="eyebrow"><span></span> Interface promises</p>
				<h2 id="principles-title">Small surface.<br />Strong boundaries.</h2>
			</div>

			<div class="principle-list">
				{#each principles as principle, index (principle.name)}
					<article>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<h3>{principle.name}</h3>
						<p>{principle.body}</p>
					</article>
				{/each}
			</div>
		</section>

		<section class="section uses" id="uses" aria-labelledby="uses-title">
			<div class="uses-intro">
				<p class="eyebrow light"><span></span> Where it fits</p>
				<h2 id="uses-title">Coordination is infrastructure.<br /><em>Keep it portable.</em></h2>
			</div>

			<div class="use-grid">
				{#each useCases as useCase, index (useCase[0])}
					<article>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<h3>{useCase[0]}</h3>
						<p>{useCase[1]}</p>
					</article>
				{/each}
			</div>
		</section>

		<section class="resources" aria-labelledby="resources-title">
			<div>
				<p class="eyebrow"><span></span> Start here</p>
				<h2 id="resources-title">Use the library.<br />Read the contracts.</h2>
			</div>
			<div class="resource-links">
				<a href="https://docs.rs/asyncband/">
					<span>01 / Documentation</span>
					<strong>Browse the API contracts</strong>
					<i>↗</i>
				</a>
				<a href="https://crates.io/crates/asyncband">
					<span>02 / Crate</span>
					<strong>Add Asyncband to a project</strong>
					<i>↗</i>
				</a>
				<a href="https://github.com/apache/asyncband">
					<span>03 / Repository</span>
					<strong>Read the source and contribute</strong>
					<i>↗</i>
				</a>
				<a href="mailto:dev@asyncband.apache.org">
					<span>04 / Community</span>
					<strong>Talk with the project</strong>
					<i>↗</i>
				</a>
			</div>
		</section>
	</main>

	<footer class="site-footer">
		<div class="footer-top">
			<a class="footer-brand" href={resolve('/')}
				>Apache Asyncband<sup>™</sup> <small>Incubating</small></a
			>
			<nav aria-label="Apache Software Foundation links">
				<a href="https://www.apache.org/">Apache Software Foundation</a>
				<a href="https://www.apache.org/licenses/">License</a>
				<a href="https://www.apache.org/security/">Security</a>
				<a href="https://www.apache.org/foundation/sponsorship.html">Sponsorship</a>
				<a href="https://www.apache.org/foundation/thanks.html">Thanks</a>
				<a href="https://privacy.apache.org/policies/privacy-policy-public.html">Privacy</a>
			</nav>
		</div>

		<div class="footer-legal">
			<p>
				Apache Asyncband, Asyncband, and Apache are either registered trademarks or trademarks of
				The Apache Software Foundation in the United States and/or other countries. All other marks
				mentioned may be trademarks or registered trademarks of their respective owners.
			</p>
			<p>Copyright © 2026 The Apache Software Foundation.</p>
		</div>
	</footer>
</div>
