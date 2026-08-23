<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { primaryNavigation } from '$lib/site';

	type NavigationHref = (typeof primaryNavigation)[number]['href'];

	function isCurrent(href: NavigationHref) {
		const path = resolve(href);
		return href === '/' ? page.url.pathname === path : page.url.pathname.startsWith(path);
	}
</script>

<header class="site-header">
	<div class="header-inner">
		<a class="wordmark" href={resolve('/')} aria-label="Apache Asyncband (Incubating) home">
			<span>Apache Asyncband<sup>™</sup></span>
			<small>Incubating</small>
		</a>

		<nav aria-label="Primary navigation">
			{#each primaryNavigation as item (item.href)}
				<a href={resolve(item.href)} aria-current={isCurrent(item.href) ? 'page' : undefined}>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="header-actions">
			<a href="https://docs.rs/asyncband/">API docs <span aria-hidden="true">↗</span></a>
			<a href="https://github.com/apache/asyncband">GitHub <span aria-hidden="true">↗</span></a>
		</div>
	</div>
</header>
