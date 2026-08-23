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
		label = 'About'
	}: {
		children: Snippet;
		toc?: Snippet;
		label?: string;
	} = $props();

	const editUrl = $derived(
		`https://github.com/apache/asyncband-site/edit/main/src/routes${page.url.pathname}+page.svelte`
	);
</script>

<div class="docs-layout">
	<aside class="docs-sidebar">
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
	</aside>

	<main id="main-content" class="docs-main">
		<div class="docs-article-column">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				<a href={resolve('/docs/about/')} aria-label="Documentation home">⌂</a>
				<span aria-hidden="true">›</span>
				<span>{label}</span>
			</nav>

			<details class="mobile-doc-navigation">
				<summary>Documentation</summary>
				<nav>
					<a href={resolve('/docs/about/')}>About</a>
					<a href={resolve('/docs/getting-started/')}>Getting Started</a>
					<a href={resolve('/docs/primitives/')}>Primitives</a>
					<a href={resolve('/docs/runtime/')}>Runtime and Blocking</a>
				</nav>
			</details>

			<article class="doc-article" data-pagefind-body>
				{@render children()}
			</article>

			<div class="doc-source">
				<a href={editUrl} rel="external">Edit this page on GitHub</a>
			</div>
		</div>

		{#if toc}
			<aside class="docs-toc" aria-label="On this page">
				{@render toc()}
			</aside>
		{/if}
	</main>
</div>
