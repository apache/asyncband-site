<!--
 Licensed to the Apache Software Foundation (ASF) under one or more contributor
 license agreements. See the NOTICE file distributed with this work for
 additional information regarding copyright ownership. The ASF licenses this
 file to you under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy of
 the License at https://www.apache.org/licenses/LICENSE-2.0.
-->

<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import bash from 'highlight.js/lib/languages/bash';
	import rust from 'highlight.js/lib/languages/rust';

	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('rust', rust);

	let { code, language }: { code: string; language: 'bash' | 'rust' } = $props();
	const highlightedCode = $derived(hljs.highlight(code, { language }).value);
</script>

<!-- highlight.js escapes source text before adding its own span markup. -->
<!-- eslint-disable svelte/no-at-html-tags -->
<pre data-language={language}><code class="hljs language-{language}">{@html highlightedCode}</code
	></pre>
<!-- eslint-enable svelte/no-at-html-tags -->
