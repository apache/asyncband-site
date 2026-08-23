<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let {
		children,
		toc,
		label = 'About',
		section = 'docs'
	}: {
		children: Snippet;
		toc?: Snippet;
		label?: string;
		section?: 'docs' | 'community';
	} = $props();
</script>

<div class="docs-layout">
	<aside class="docs-sidebar">
		{#if section === 'docs'}
			<nav aria-label="Documentation sidebar">
				<a
					class="sidebar-item"
					class:active={page.url.pathname === resolve('/docs/about/')}
					href={resolve('/docs/about/')}>About</a
				>
				<a
					class="sidebar-item"
					class:active={page.url.pathname === resolve('/docs/getting-started/')}
					href={resolve('/docs/getting-started/')}>Getting Started</a
				>
				<a
					class="sidebar-item"
					class:active={page.url.pathname === resolve('/docs/primitives/')}
					href={resolve('/docs/primitives/')}>Primitives</a
				>
				<a
					class="sidebar-item"
					class:active={page.url.pathname === resolve('/docs/runtime/')}
					href={resolve('/docs/runtime/')}>Runtime and Blocking</a
				>
				<p class="sidebar-heading">Reference</p>
				<a class="sidebar-item external" href="https://docs.rs/asyncband/">API documentation</a>
			</nav>
		{:else}
			<nav aria-label="Community sidebar">
				<a class="sidebar-item active" href={resolve('/community/')}>Community</a>
				<p class="sidebar-heading">Project</p>
				<a class="sidebar-item external" href="https://incubator.apache.org/projects/asyncband.html"
					>Project status</a
				>
				<a class="sidebar-item external" href="https://github.com/apache/asyncband"
					>Source repository</a
				>
				<a class="sidebar-item external" href="https://github.com/apache/asyncband/issues"
					>Issue tracker</a
				>
				<a class="sidebar-item external" href="mailto:dev@asyncband.apache.org"
					>Development mailing list</a
				>
				<a class="sidebar-item external" href="https://github.com/apache/asyncband-site"
					>Website source</a
				>
			</nav>
		{/if}
	</aside>

	<main id="main-content" class="docs-main">
		<div class="docs-article-column">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				{#if section === 'docs'}
					<a href={resolve('/docs/about/')} aria-label="Documentation home">⌂</a>
				{:else}
					<a href={resolve('/community/')} aria-label="Community home">⌂</a>
				{/if}
				<span aria-hidden="true">›</span>
				<span>{label}</span>
			</nav>

			<details class="mobile-doc-navigation">
				<summary>{section === 'docs' ? 'Documentation' : 'Community'}</summary>
				{#if section === 'docs'}
					<nav>
						<a href={resolve('/docs/about/')}>About</a>
						<a href={resolve('/docs/getting-started/')}>Getting Started</a>
						<a href={resolve('/docs/primitives/')}>Primitives</a>
						<a href={resolve('/docs/runtime/')}>Runtime and Blocking</a>
					</nav>
				{:else}
					<nav>
						<a href={resolve('/community/')}>Community</a>
						<a href="https://incubator.apache.org/projects/asyncband.html">Project status</a>
						<a href="https://github.com/apache/asyncband">Source repository</a>
						<a href="mailto:dev@asyncband.apache.org">Development mailing list</a>
					</nav>
				{/if}
			</details>

			<article class="doc-article">
				{@render children()}
			</article>

			<div class="doc-source">
				<a href="https://github.com/apache/asyncband-site">Edit this site on GitHub</a>
			</div>
		</div>

		{#if toc}
			<aside class="docs-toc" aria-label="On this page">
				{@render toc()}
			</aside>
		{/if}
	</main>
</div>
