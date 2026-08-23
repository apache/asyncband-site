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
</script>

<aside class="incubation" aria-labelledby="incubation-title">
	<div class="container incubation-grid">
		<div>
			<p class="section-label">Apache Incubator</p>
			<h2 id="incubation-title">Apache Asyncband is incubating.</h2>
		</div>
		<div class="incubation-copy">
			<p>
				Apache Asyncband (Incubating) is an effort undergoing incubation at the Apache Software
				Foundation (ASF), sponsored by the Apache Incubator PMC. Incubation is required of all newly
				accepted projects until a further review indicates that the infrastructure, communications,
				and decision making process have stabilized in a manner consistent with other successful ASF
				projects. While incubation status is not necessarily a reflection of the completeness or
				stability of the code, it does indicate that the project has yet to be fully endorsed by the
				ASF.
			</p>
			<a class="text-link" href="https://incubator.apache.org/projects/asyncband.html">
				View incubation status <span aria-hidden="true">↗</span>
			</a>
		</div>
	</div>
</aside>

<footer class="site-footer">
	<div class="container footer-grid">
		<div class="footer-identity">
			<a href={resolve('/')} class="footer-wordmark">Apache Asyncband<sup>™</sup></a>
			<p>Runtime-agnostic synchronization and coordination tools for asynchronous Rust.</p>
		</div>

		<nav aria-label="Project links">
			<strong>Project</strong>
			<a href="https://docs.rs/asyncband/">API documentation</a>
			<a href="https://crates.io/crates/asyncband">Crate</a>
			<a href="https://github.com/apache/asyncband">Source repository</a>
			<a href="mailto:dev@asyncband.apache.org">Development mailing list</a>
		</nav>

		<nav aria-label="Apache Software Foundation links">
			<strong>Apache</strong>
			<a href="https://www.apache.org/">Foundation</a>
			<a href="https://www.apache.org/licenses/">License</a>
			<a href="https://www.apache.org/security/">Security</a>
			<a href="https://www.apache.org/foundation/sponsorship.html">Sponsorship</a>
			<a href="https://www.apache.org/foundation/thanks.html">Thanks</a>
			<a href="https://privacy.apache.org/policies/privacy-policy-public.html">Privacy</a>
		</nav>
	</div>

	<div class="container footer-legal">
		<p>
			Apache Asyncband, Asyncband, and Apache are either registered trademarks or trademarks of The
			Apache Software Foundation in the United States and/or other countries. All other marks
			mentioned may be trademarks or registered trademarks of their respective owners.
		</p>
		<p>Copyright © 2026 The Apache Software Foundation.</p>
	</div>
</footer>
