<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import '../app.css';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#ffffff" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://asyncband.apache.org/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Apache Asyncband (Incubating)" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://asyncband.apache.org/og.png" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<SiteHeader />
{@render children()}
<SiteFooter />
