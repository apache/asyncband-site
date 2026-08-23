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
	import DocsShell from '$lib/components/DocsShell.svelte';
	import { primitiveGroups } from '$lib/site';
</script>

<svelte:head>
	<title>Available APIs | Apache Asyncband</title>
	<meta
		name="description"
		content="Apache Asyncband primitives, Cargo features, public paths, and purposes."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/docs/primitives/" />
	<meta property="og:url" content="https://asyncband.apache.org/docs/primitives/" />
	<meta property="og:title" content="Available APIs | Apache Asyncband" />
</svelte:head>

<DocsShell label="Primitives">
	{#snippet toc()}
		<ul>
			{#each primitiveGroups as group (group.id)}
				<li><a href={resolve(`/docs/primitives/#${group.id}`)}>{group.name}</a></li>
			{/each}
			<li><a href="#blocking">Blocking Interoperability</a></li>
		</ul>
	{/snippet}

	<h1>Available APIs</h1>
	<p>
		The crate enables no APIs by default. Categories describe each API's primary purpose and do not
		add another module level.
	</p>

	{#each primitiveGroups as group (group.id)}
		<h2 id={group.id}>{group.name}</h2>
		<div class="table-wrapper">
			<table>
				<thead>
					<tr><th>API</th><th>Feature</th><th>Purpose</th></tr>
				</thead>
				<tbody>
					{#each group.items as item (item.path)}
						<tr>
							<td>
								<!-- item.docs is an absolute external URL. -->
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={item.docs}>{item.name}</a><br />
								<code>{item.path}</code>
							</td>
							<td><code>{item.feature}</code></td>
							<td>{item.purpose}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}

	<h2 id="blocking">Blocking Interoperability</h2>
	<p>
		The optional <code>blocking</code> module bridges synchronous Rust code to runtime-agnostic futures.
		It is an interoperability utility rather than another async primitive, so it is documented separately
		from the tables above.
	</p>
	<pre><code>cargo add asyncband --features blocking</code></pre>
	<p>
		See <a href={resolve('/docs/runtime/#synchronous-interoperability')}>Runtime and Blocking</a>
		for the execution model and constraints.
	</p>
</DocsShell>
