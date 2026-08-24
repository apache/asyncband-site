// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import rust from 'highlight.js/lib/languages/rust';
import { escapeSvelte, type MdsvexOptions } from 'mdsvex';
import path from 'node:path';

type MarkdownNode = {
	type: string;
	depth?: number;
	value?: string;
	children?: MarkdownNode[];
	data?: {
		hProperties?: Record<string, string>;
	};
	tagName?: string;
	properties?: Record<string, unknown>;
};

type MarkdownFile = {
	data: {
		fm?: Record<string, unknown>;
	};
};

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('rust', rust);

function nodeText(node: MarkdownNode): string {
	if (node.value) return node.value;
	return node.children?.map(nodeText).join('') ?? '';
}

function slugify(value: string): string {
	return value
		.normalize('NFKD')
		.toLowerCase()
		.replace(/[‘’']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function collectTableOfContents() {
	return (tree: MarkdownNode, file: MarkdownFile) => {
		const toc: { id: string; label: string }[] = [];
		const identifiers = new Map<string, number>();
		const headingIds = file.data.fm?.headingIds;
		const tocLabels = file.data.fm?.tocLabels;

		function visit(node: MarkdownNode) {
			if (node.type === 'heading' && node.depth === 2) {
				const label = nodeText(node);
				const configuredLabel =
					typeof tocLabels === 'object' && tocLabels
						? (tocLabels as Record<string, unknown>)[label]
						: undefined;
				const configuredId =
					typeof headingIds === 'object' && headingIds
						? (headingIds as Record<string, unknown>)[label]
						: undefined;
				const base =
					typeof configuredId === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(configuredId)
						? configuredId
						: slugify(label);
				const occurrence = (identifiers.get(base) ?? 0) + 1;
				const id = occurrence === 1 ? base : `${base}-${occurrence}`;

				identifiers.set(base, occurrence);
				node.data ??= {};
				node.data.hProperties = { ...node.data.hProperties, id };
				toc.push({ id, label: typeof configuredLabel === 'string' ? configuredLabel : label });
			}

			node.children?.forEach(visit);
		}

		visit(tree);
		file.data.fm ??= {};
		file.data.fm.toc = toc;
	};
}

function wrapTables() {
	return (tree: MarkdownNode) => {
		function visit(node: MarkdownNode) {
			if (!node.children) return;

			node.children = node.children.map((child) => {
				if (child.type === 'element' && child.tagName === 'table') {
					return {
						type: 'element',
						tagName: 'div',
						properties: { className: ['table-wrapper'] },
						children: [child]
					};
				}

				visit(child);
				return child;
			});
		}

		visit(tree);
	};
}

function highlightCode(code: string, language?: string | null): string {
	const normalizedLanguage = language === 'shell' || language === 'sh' ? 'bash' : language;
	const knownLanguage = normalizedLanguage && hljs.getLanguage(normalizedLanguage);
	const result = knownLanguage
		? hljs.highlight(code, { language: normalizedLanguage })
		: hljs.highlightAuto(code);
	const languageAttribute = knownLanguage ? ` data-language="${normalizedLanguage}"` : '';
	const languageClass = knownLanguage ? ` language-${normalizedLanguage}` : '';

	return `<pre${languageAttribute}><code class="hljs${languageClass}">{@html \`${escapeSvelte(result.value)}\`}</code></pre>`;
}

const config: MdsvexOptions = {
	extensions: ['.svx'],
	layout: path.resolve(import.meta.dirname, 'src/lib/components/MarkdownPage.svelte'),
	layoutPropForwarding: 'runes',
	smartypants: false,
	highlight: { highlighter: highlightCode },
	remarkPlugins: [collectTableOfContents],
	rehypePlugins: [wrapTables]
};

export default config;
