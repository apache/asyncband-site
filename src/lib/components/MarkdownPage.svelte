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

	let {
		children,
		title,
		description,
		canonical,
		ogTitle = title
	}: {
		children: Snippet;
		title: string;
		description: string;
		canonical: string;
		ogTitle?: string;
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={description} />
</svelte:head>

<main id="main-content" class="readme-page">
	<article class="readme-article">
		{@render children()}
	</article>
</main>
