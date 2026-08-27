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

	type PagefindSubResult = {
		title: string;
		url: string;
		plain_excerpt?: string;
	};

	type PagefindResultData = {
		url: string;
		plain_excerpt?: string;
		meta: { title?: string };
		sub_results?: PagefindSubResult[];
	};

	type PagefindApi = {
		init(): Promise<void>;
		debouncedSearch(
			term: string,
			options?: Record<string, unknown>,
			debounceTimeout?: number
		): Promise<{
			results: Array<{ data(): Promise<PagefindResultData> }>;
		} | null>;
	};

	type DisplayResult = {
		title: string;
		url: string;
		excerpt: string;
	};

	// oxlint-disable-next-line no-unassigned-vars -- Assigned by Svelte's bind:this directive.
	let dialog: HTMLDialogElement;
	// oxlint-disable-next-line no-unassigned-vars -- Assigned by Svelte's bind:this directive.
	let input: HTMLInputElement;
	let query = $state('');
	let results = $state<DisplayResult[]>([]);
	let loading = $state(false);
	let searchError = $state('');
	let searchVersion = 0;
	let pagefindPromise: Promise<PagefindApi> | undefined;

	$effect(() => {
		const term = query.trim();
		const version = ++searchVersion;

		if (term.length < 2) {
			results = [];
			loading = false;
			searchError = '';
			return;
		}

		loading = true;
		searchError = '';
		void runSearch(term, version);
	});

	function loadPagefind() {
		if (!pagefindPromise) {
			const pagefindPath = '/pagefind/pagefind.js';
			pagefindPromise = import(/* @vite-ignore */ pagefindPath)
				.then(async (module) => {
					const pagefind = module as PagefindApi;
					await pagefind.init();
					return pagefind;
				})
				.catch((error: unknown) => {
					pagefindPromise = undefined;
					throw error;
				});
		}

		return pagefindPromise;
	}

	async function runSearch(term: string, version: number) {
		try {
			const pagefind = await loadPagefind();
			const search = await pagefind.debouncedSearch(term);
			if (!search || version !== searchVersion) return;

			const pages = await Promise.all(search.results.slice(0, 6).map((result) => result.data()));
			if (version !== searchVersion) return;

			const matches = pages.flatMap((page) => {
				const pageTitle = page.meta.title ?? 'Untitled page';
				const subResults = page.sub_results?.length
					? page.sub_results
					: [
							{
								title: pageTitle,
								url: page.url,
								plain_excerpt: page.plain_excerpt
							}
						];

				return subResults.slice(0, 3).map((result) => ({
					title: result.title || pageTitle,
					url: result.url,
					excerpt: result.plain_excerpt ?? ''
				}));
			});

			results = [...new Map(matches.map((result) => [result.url, result])).values()].slice(0, 8);
		} catch {
			if (version !== searchVersion) return;
			results = [];
			searchError = 'Search is available in the production preview after running pnpm build.';
		} finally {
			if (version === searchVersion) loading = false;
		}
	}

	async function openSearch() {
		dialog.showModal();
		void loadPagefind().catch(() => undefined);
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
		<p>
			{loading
				? 'Searching…'
				: query.trim().length < 2
					? 'Search the site'
					: `${results.length} results`}
		</p>
		{#if searchError}
			<div class="search-empty">{searchError}</div>
		{:else if results.length > 0}
			{#each results as result (result.url)}
				<!-- Pagefind only returns URLs generated from local static pages. -->
				<a href={result.url} onclick={closeSearch}>
					<span class="search-result-main">
						<strong>{result.title}</strong>
						{#if result.excerpt}<small>{result.excerpt}</small>{/if}
					</span>
					<span class="search-result-path">{result.url}</span>
				</a>
			{/each}
		{:else if query.trim().length >= 2 && !loading}
			<div class="search-empty">No documentation matched “{query.trim()}”.</div>
		{:else}
			<div class="search-empty">Type at least two characters to search.</div>
		{/if}
	</div>
</dialog>
