// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at https://www.apache.org/licenses/LICENSE-2.0.

import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import type { PreprocessorGroup } from 'svelte/compiler';
import { defineConfig } from 'vite';
import mdsvexConfig from './mdsvex.config.ts';

const modernizeMdsvexOutput: PreprocessorGroup = {
	name: 'modernize-mdsvex-output',
	markup: ({ content, filename }) => {
		if (!filename?.endsWith('.svx')) return;

		// MDsveX still emits Svelte's deprecated module-script spelling.
		return { code: content.replace('<script context="module">', '<script module>') };
	}
};

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.svx'],
			preprocess: [mdsvex(mdsvexConfig), modernizeMdsvexOutput],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	]
});
