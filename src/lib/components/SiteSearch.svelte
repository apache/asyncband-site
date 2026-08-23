<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';

	type SearchEntry = {
		title: string;
		page: string;
		href: string;
		keywords: string;
		featured: boolean;
	};

	const searchEntries = [
		{
			title: 'About Apache Asyncband',
			page: 'Documentation',
			href: '/docs/about/',
			keywords: 'runtime agnostic synchronization coordination asynchronous Rust',
			featured: true
		},
		{
			title: 'Installation',
			page: 'About',
			href: '/docs/about/#installation',
			keywords: 'cargo add dependency features',
			featured: false
		},
		{
			title: 'Getting Started',
			page: 'Documentation',
			href: '/docs/getting-started/',
			keywords: 'install mutex example cargo features',
			featured: true
		},
		{
			title: 'Available APIs',
			page: 'Documentation',
			href: '/docs/primitives/',
			keywords:
				'mutex rwlock condvar once oncecell oncemap barrier latch waitgroup shutdown oneshot mpsc pool semaphore singleflight',
			featured: true
		},
		{
			title: 'Shared state',
			page: 'Primitives',
			href: '/docs/primitives/#shared-state',
			keywords: 'mutex rwlock condvar locks',
			featured: false
		},
		{
			title: 'One-time initialization',
			page: 'Primitives',
			href: '/docs/primitives/#initialization',
			keywords: 'once oncecell oncemap initialize',
			featured: false
		},
		{
			title: 'Task coordination',
			page: 'Primitives',
			href: '/docs/primitives/#task-coordination',
			keywords: 'barrier latch waitgroup shutdown tasks',
			featured: false
		},
		{
			title: 'Channels',
			page: 'Primitives',
			href: '/docs/primitives/#channels',
			keywords: 'oneshot mpsc bounded unbounded send values',
			featured: false
		},
		{
			title: 'Resource reuse',
			page: 'Primitives',
			href: '/docs/primitives/#resource-reuse',
			keywords: 'pool bounded unbounded managed objects',
			featured: false
		},
		{
			title: 'Workload control',
			page: 'Primitives',
			href: '/docs/primitives/#workload-control',
			keywords: 'semaphore singleflight group permits concurrency',
			featured: false
		},
		{
			title: 'Runtime and Blocking',
			page: 'Documentation',
			href: '/docs/runtime/',
			keywords: 'executor runtime agnostic synchronous blocking future',
			featured: true
		},
		{
			title: 'Synchronous interoperability',
			page: 'Runtime and Blocking',
			href: '/docs/runtime/#synchronous-interoperability',
			keywords: 'blocking block_on wait_timeout sync future',
			featured: false
		},
		{
			title: 'Execution constraints',
			page: 'Runtime and Blocking',
			href: '/docs/runtime/#execution-constraints',
			keywords: 'timer io driver starvation deadlock timeout',
			featured: false
		},
		{
			title: 'Thread safety',
			page: 'Runtime and Blocking',
			href: '/docs/runtime/#thread-safety',
			keywords: 'send sync guards values bounds',
			featured: false
		},
		{
			title: 'Minimum supported Rust version',
			page: 'Runtime and Blocking',
			href: '/docs/runtime/#msrv',
			keywords: 'msrv rustc 1.86',
			featured: false
		},
		{
			title: 'Downloads',
			page: 'Releases',
			href: '/downloads/',
			keywords: 'release source archive signature checksum',
			featured: true
		}
	] as const satisfies readonly SearchEntry[];

	let dialog: HTMLDialogElement;
	let input: HTMLInputElement;
	let query = $state('');

	const results = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();

		if (!normalizedQuery) {
			return searchEntries.filter((entry) => entry.featured);
		}

		return searchEntries
			.filter((entry) => `${entry.title} ${entry.keywords}`.toLowerCase().includes(normalizedQuery))
			.slice(0, 8);
	});

	async function openSearch() {
		dialog.showModal();
		await tick();
		input.focus();
	}

	function closeSearch() {
		dialog.close();
	}

	function handleShortcut(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			if (dialog.open) {
				closeSearch();
			} else {
				void openSearch();
			}
		}
	}
</script>

<svelte:window onkeydown={handleShortcut} />

<button class="search-trigger" type="button" onclick={openSearch}>
	<span class="search-icon" aria-hidden="true"></span>
	<span>Search docs</span>
	<kbd>⌘K</kbd>
</button>

<dialog class="search-dialog" bind:this={dialog} onclose={() => (query = '')}>
	<div class="search-input-row">
		<span class="search-icon" aria-hidden="true"></span>
		<input
			bind:this={input}
			bind:value={query}
			type="search"
			placeholder="Search documentation"
			aria-label="Search documentation"
		/>
		<button type="button" onclick={closeSearch}>Close</button>
	</div>

	<div class="search-results" aria-live="polite">
		<p>{query.trim() ? `${results.length} results` : 'Browse documentation'}</p>
		{#if results.length > 0}
			{#each results as result (result.href)}
				<a href={resolve(result.href)} onclick={closeSearch}>
					<strong>{result.title}</strong>
					<span>{result.page}</span>
				</a>
			{/each}
		{:else}
			<div class="search-empty">No documentation matched “{query.trim()}”.</div>
		{/if}
	</div>
</dialog>
