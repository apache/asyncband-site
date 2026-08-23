<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import DocsShell from '$lib/components/DocsShell.svelte';
</script>

<svelte:head>
	<title>Community | Apache Asyncband</title>
	<meta
		name="description"
		content="Apache Asyncband community links, public repository, issue tracker, mailing list, and incubation status."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/community/" />
	<meta property="og:url" content="https://asyncband.apache.org/community/" />
	<meta property="og:title" content="Community | Apache Asyncband" />
</svelte:head>

<DocsShell label="Community" section="community">
	{#snippet toc()}
		<ul>
			<li><a href="#mailing-list">Development Mailing List</a></li>
			<li><a href="#source-and-issues">Source and Issues</a></li>
			<li><a href="#incubation">Incubation</a></li>
			<li><a href="#resources">Project Resources</a></li>
		</ul>
	{/snippet}

	<h1>Apache Asyncband Community</h1>

	<h2 id="mailing-list">Development Mailing List</h2>
	<p>
		Use <a href="mailto:dev@asyncband.apache.org">dev@asyncband.apache.org</a> for project discussion.
	</p>

	<h2 id="source-and-issues">Source and Issues</h2>
	<ul>
		<li><a href="https://github.com/apache/asyncband">Source repository</a></li>
		<li><a href="https://github.com/apache/asyncband/issues">Issue tracker</a></li>
		<li><a href="https://github.com/apache/asyncband-site">Website source</a></li>
	</ul>

	<h2 id="incubation">Incubation</h2>
	<p>
		Apache Asyncband entered the Apache Incubator on August 19, 2026. The project is sponsored by
		the Apache Incubator PMC.
	</p>
	<p>
		See the <a href="https://incubator.apache.org/projects/asyncband.html"
			>official project status page</a
		>
		for current incubation information.
	</p>

	<h2 id="resources">Project Resources</h2>
	<div class="table-wrapper">
		<table>
			<thead><tr><th>Resource</th><th>Location</th></tr></thead>
			<tbody>
				<tr
					><td>API documentation</td><td
						><a href="https://docs.rs/asyncband/">docs.rs/asyncband</a></td
					></tr
				>
				<tr
					><td>Published crate</td><td
						><a href="https://crates.io/crates/asyncband">crates.io/crates/asyncband</a></td
					></tr
				>
				<tr
					><td>License</td><td
						><a href="https://github.com/apache/asyncband/blob/main/LICENSE">Apache License 2.0</a
						></td
					></tr
				>
				<tr
					><td>Disclaimer</td><td
						><a href="https://github.com/apache/asyncband/blob/main/DISCLAIMER"
							>Incubation disclaimer</a
						></td
					></tr
				>
			</tbody>
		</table>
	</div>
</DocsShell>
