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
	import SiteSearch from './SiteSearch.svelte';
</script>

<header class="navbar">
	<div class="navbar-inner">
		<a class="navbar-brand" href={resolve('/')}>
			<span>Apache Asyncband</span>
			<small>Incubating</small>
		</a>

		<nav class="navbar-links" aria-label="Primary navigation">
			<a class:active={page.url.pathname.startsWith('/docs/')} href={resolve('/docs/about/')}
				>Documentation</a
			>
			<a class:active={page.url.pathname === resolve('/downloads/')} href={resolve('/downloads/')}
				>Downloads</a
			>
			<a href="https://docs.rs/asyncband/">API Docs <span aria-hidden="true">↗</span></a>
			<a
				class="github-link"
				href="https://github.com/apache/asyncband"
				aria-label="GitHub repository"
			></a>
			<SiteSearch />
			<details class="asf-menu">
				<summary>ASF</summary>
				<div>
					<a href="https://www.apache.org/">Foundation</a>
					<a href="https://www.apache.org/licenses/">License</a>
					<a href="https://www.apache.org/events/current-event.html">Events</a>
					<a href="https://www.apache.org/security/">Security</a>
					<a href="https://www.apache.org/foundation/sponsorship.html">Sponsorship</a>
					<a href="https://privacy.apache.org/policies/privacy-policy-public.html">Privacy</a>
					<a href="https://www.apache.org/foundation/thanks.html">Thanks</a>
				</div>
			</details>
		</nav>

		<details class="mobile-menu">
			<summary aria-label="Open navigation">☰</summary>
			<nav aria-label="Mobile navigation">
				<a href={resolve('/docs/about/')}>Documentation</a>
				<a href={resolve('/downloads/')}>Downloads</a>
				<a href="https://docs.rs/asyncband/">API docs</a>
				<a href="https://github.com/apache/asyncband">GitHub</a>
			</nav>
		</details>
	</div>
</header>
