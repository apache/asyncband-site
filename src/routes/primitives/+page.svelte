<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at

     https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.
-->

<script lang="ts">
	import { resolve } from '$app/paths';
	import { primitiveGroups } from '$lib/site';
</script>

<svelte:head>
	<title>Primitives — Apache Asyncband™ (Incubating)</title>
	<meta
		name="description"
		content="Asyncband primitives, public paths, Cargo features, and API documentation."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/primitives/" />
	<meta property="og:url" content="https://asyncband.apache.org/primitives/" />
	<meta property="og:title" content="Primitives — Apache Asyncband™ (Incubating)" />
	<meta
		property="og:description"
		content="Asyncband primitives, public paths, Cargo features, and API documentation."
	/>
</svelte:head>

<main id="main-content">
	<header class="page-hero">
		<div class="container page-hero-inner">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				<a href={resolve('/')}>Home</a><span aria-hidden="true">/</span><span>Primitives</span>
			</nav>
			<p class="section-label">Library reference</p>
			<h1>Primitives and Cargo features</h1>
			<p>
				Asyncband enables no APIs by default. Select each primitive through its feature, then use it
				from the public path shown below.
			</p>
		</div>
	</header>

	<section class="document-section">
		<div class="container document-layout">
			<aside class="page-toc">
				<strong>On this page</strong>
				<nav aria-label="Page contents">
					{#each primitiveGroups as group (group.id)}
						<a href={resolve(`/primitives/#${group.id}`)}>{group.name}</a>
					{/each}
					<a href="#blocking">Blocking interoperability</a>
				</nav>
			</aside>

			<div class="document-content">
				{#each primitiveGroups as group (group.id)}
					<section class="primitive-group" id={group.id} aria-labelledby={`${group.id}-heading`}>
						<div class="group-heading">
							<h2 id={`${group.id}-heading`}>{group.name}</h2>
							<p>{group.description}</p>
						</div>

						<div class="table-scroll">
							<table>
								<thead>
									<tr>
										<th scope="col">API</th>
										<th scope="col">Feature</th>
										<th scope="col">Purpose</th>
									</tr>
								</thead>
								<tbody>
									{#each group.items as item (item.path)}
										<tr>
											<th scope="row">
												<!-- item.docs is always an absolute external URL, not a SvelteKit route. -->
												<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
												<a href={item.docs}>{item.name} <span aria-hidden="true">↗</span></a>
												<code>{item.path}</code>
											</th>
											<td><code>{item.feature}</code></td>
											<td>{item.purpose}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>
				{/each}

				<section class="primitive-group" id="blocking" aria-labelledby="blocking-heading">
					<div class="group-heading">
						<h2 id="blocking-heading">Blocking interoperability</h2>
						<p>
							The optional <code>blocking</code> module lets synchronous callers drive runtime-agnostic
							futures. It is documented separately because it is an adapter, not an asynchronous synchronization
							primitive.
						</p>
					</div>
					<div class="feature-callout">
						<div>
							<strong>Feature</strong>
							<code>blocking</code>
						</div>
						<div>
							<strong>Public API</strong>
							<a href="https://github.com/apache/asyncband/blob/main/asyncband/src/blocking/mod.rs">
								<code>asyncband::blocking::FutureExt</code> <span aria-hidden="true">↗</span>
							</a>
						</div>
					</div>
				</section>
			</div>
		</div>
	</section>
</main>
