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
</script>

<svelte:head>
	<title>Project — Apache Asyncband™ (Incubating)</title>
	<meta
		name="description"
		content="Apache Asyncband incubation status, project resources, and community contacts."
	/>
	<link rel="canonical" href="https://asyncband.apache.org/project/" />
	<meta property="og:url" content="https://asyncband.apache.org/project/" />
	<meta property="og:title" content="Project — Apache Asyncband™ (Incubating)" />
	<meta
		property="og:description"
		content="Apache Asyncband incubation status, project resources, and community contacts."
	/>
</svelte:head>

<main id="main-content">
	<header class="page-hero">
		<div class="container page-hero-inner">
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				<a href={resolve('/')}>Home</a><span aria-hidden="true">/</span><span>Project</span>
			</nav>
			<p class="section-label">Apache project</p>
			<h1>Project and community</h1>
			<p>
				Apache Asyncband (Incubating) is developed in the open at the Apache Software Foundation.
				Use the public repository, issue tracker, and development mailing list to participate.
			</p>
		</div>
	</header>

	<section class="document-section">
		<div class="container document-layout">
			<aside class="page-toc">
				<strong>On this page</strong>
				<nav aria-label="Page contents">
					<a href="#incubation">Incubation</a>
					<a href="#participate">Participate</a>
					<a href="#resources">Project resources</a>
					<a href="#history">Name history</a>
					<a href="#apache">Apache links</a>
				</nav>
			</aside>

			<div class="document-content document-prose">
				<section id="incubation" aria-labelledby="incubation-page-heading">
					<p class="section-label">01 / Status</p>
					<h2 id="incubation-page-heading">Incubation</h2>
					<p>
						Asyncband entered the Apache Incubator on August 19, 2026. The project is sponsored by
						the Apache Incubator PMC while its infrastructure, communications, and decision-making
						processes develop within the ASF.
					</p>
					<dl class="project-details">
						<div>
							<dt>Status</dt>
							<dd>Incubating</dd>
						</div>
						<div>
							<dt>Entry date</dt>
							<dd>August 19, 2026</dd>
						</div>
						<div>
							<dt>Sponsor</dt>
							<dd>Apache Incubator PMC</dd>
						</div>
						<div>
							<dt>License</dt>
							<dd>Apache License 2.0</dd>
						</div>
					</dl>
					<a class="text-link" href="https://incubator.apache.org/projects/asyncband.html">
						View the official project status <span aria-hidden="true">↗</span>
					</a>
				</section>

				<section id="participate" aria-labelledby="participate-heading">
					<p class="section-label">02 / Community</p>
					<h2 id="participate-heading">Participate in public</h2>
					<div class="link-cards">
						<a href="https://github.com/apache/asyncband">
							<strong>Source repository</strong>
							<span>Read the code and contribution history.</span>
							<i aria-hidden="true">↗</i>
						</a>
						<a href="https://github.com/apache/asyncband/issues">
							<strong>Issue tracker</strong>
							<span>Report bugs and discuss scoped changes.</span>
							<i aria-hidden="true">↗</i>
						</a>
						<a href="mailto:dev@asyncband.apache.org">
							<strong>Development mailing list</strong>
							<span>Contact the project at dev@asyncband.apache.org.</span>
							<i aria-hidden="true">↗</i>
						</a>
					</div>
				</section>

				<section id="resources" aria-labelledby="project-resources-heading">
					<p class="section-label">03 / Resources</p>
					<h2 id="project-resources-heading">Project resources</h2>
					<div class="link-list">
						<a href="https://docs.rs/asyncband/"><span>API documentation</span><i>docs.rs ↗</i></a>
						<a href="https://crates.io/crates/asyncband"
							><span>Published crate</span><i>crates.io ↗</i></a
						>
						<a href="https://github.com/apache/asyncband/blob/main/LICENSE"
							><span>License</span><i>Apache 2.0 ↗</i></a
						>
						<a href="https://github.com/apache/asyncband/blob/main/DISCLAIMER"
							><span>Incubation disclaimer</span><i>Repository ↗</i></a
						>
						<a href="https://github.com/apache/asyncband-site"
							><span>Website source</span><i>GitHub ↗</i></a
						>
					</div>
				</section>

				<section id="history" aria-labelledby="history-heading">
					<p class="section-label">04 / History</p>
					<h2 id="history-heading">Formerly published as MEA</h2>
					<p>
						Asyncband was formerly published as MEA. The <code>mea</code> crate is deprecated and receives
						no further development.
					</p>
					<a class="text-link" href="https://github.com/apache/asyncband/blob/main/MIGRATE.md">
						Read the migration guide <span aria-hidden="true">↗</span>
					</a>
				</section>

				<section id="apache" aria-labelledby="apache-heading">
					<p class="section-label">05 / Foundation</p>
					<h2 id="apache-heading">Apache Software Foundation</h2>
					<div class="link-list two-column-links">
						<a href="https://www.apache.org/"><span>Foundation</span><i>apache.org ↗</i></a>
						<a href="https://www.apache.org/licenses/"><span>Licenses</span><i>apache.org ↗</i></a>
						<a href="https://www.apache.org/security/"><span>Security</span><i>apache.org ↗</i></a>
						<a href="https://www.apache.org/foundation/sponsorship.html"
							><span>Sponsorship</span><i>apache.org ↗</i></a
						>
						<a href="https://www.apache.org/foundation/thanks.html"
							><span>Thanks</span><i>apache.org ↗</i></a
						>
						<a href="https://privacy.apache.org/policies/privacy-policy-public.html"
							><span>Privacy</span><i>apache.org ↗</i></a
						>
					</div>
				</section>
			</div>
		</div>
	</section>
</main>
