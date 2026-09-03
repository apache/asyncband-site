// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements. See the NOTICE file distributed with this work for
// additional information regarding copyright ownership. The ASF licenses this
// file to you under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at https://www.apache.org/licenses/LICENSE-2.0.

import type { Options as PresetOptions, ThemeConfig } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const asfLinks = [
	{ label: 'Foundation', href: 'https://www.apache.org/' },
	{ label: 'License', href: 'https://www.apache.org/licenses/' },
	{ label: 'Events', href: 'https://www.apache.org/events/current-event.html' },
	{ label: 'Security', href: 'https://www.apache.org/security/' },
	{ label: 'Sponsorship', href: 'https://www.apache.org/foundation/sponsorship.html' },
	{ label: 'Privacy', href: 'https://privacy.apache.org/policies/privacy-policy-public.html' },
	{ label: 'Thanks', href: 'https://www.apache.org/foundation/thanks.html' }
];

const config: Config = {
	title: 'Apache Asyncband',
	tagline:
		'Runtime-agnostic synchronization and coordination tools for asynchronous Rust programming',
	favicon: 'favicon.svg',

	url: 'https://asyncband.apache.org',
	baseUrl: '/',
	trailingSlash: true,

	onBrokenLinks: 'throw',

	markdown: {
		format: 'detect',
		hooks: {
			onBrokenMarkdownLinks: 'throw'
		}
	},

	i18n: {
		defaultLocale: 'en',
		locales: ['en']
	},

	presets: [
		[
			'classic',
			{
				docs: {
					routeBasePath: 'docs',
					sidebarPath: './sidebars.ts',
					editUrl: 'https://github.com/apache/asyncband-site/edit/main/docs/'
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css'
				}
			} satisfies PresetOptions
		]
	],

	themes: [
		[
			'@easyops-cn/docusaurus-search-local',
			{
				hashed: true,
				docsRouteBasePath: ['/docs'],
				indexPages: true,
				indexBlog: false,
				language: ['en']
			}
		]
	],

	themeConfig: {
		image: 'og.png',
		colorMode: {
			defaultMode: 'light',
			respectPrefersColorScheme: true
		},
		navbar: {
			title: 'Apache Asyncband',
			items: [
				{ type: 'doc', docId: 'about', position: 'left', label: 'Documentation' },
				{ to: '/downloads', label: 'Downloads', position: 'left' },
				{ type: 'dropdown', label: 'ASF', position: 'right', items: asfLinks },
				{
					href: 'https://github.com/apache/asyncband',
					position: 'right',
					className: 'header-github-link',
					'aria-label': 'GitHub repository'
				}
			]
		},
		footer: {
			style: 'dark',
			logo: {
				alt: 'Apache Software Foundation',
				src: 'asf-logo.svg',
				href: 'https://www.apache.org/',
				width: 175
			},
			links: [
				{
					title: 'Documentation',
					items: [
						{ label: 'About', to: '/docs/about' },
						{ label: 'Downloads', to: '/downloads' },
						{ label: 'API documentation', href: 'https://docs.rs/asyncband/' }
					]
				},
				{ title: 'ASF', items: asfLinks }
			],
			copyright: `Apache Asyncband (Incubating) is an effort undergoing incubation at the Apache Software Foundation (ASF), sponsored by the Apache Incubator PMC. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.<br/><br/>Apache Asyncband, Asyncband, and Apache are either registered trademarks or trademarks of The Apache Software Foundation in the United States and/or other countries. All other marks mentioned may be trademarks or registered trademarks of their respective owners.`
		},
		prism: {
			theme: themes.github,
			darkTheme: themes.dracula,
			additionalLanguages: ['rust', 'bash', 'toml']
		}
	} satisfies ThemeConfig
};

export default config;
