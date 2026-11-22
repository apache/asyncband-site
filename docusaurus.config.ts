import type { Options as PresetOptions, ThemeConfig } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const asfLinks = [
	{ label: 'Foundation', href: 'https://www.apache.org/' },
	{ label: 'Incubator', href: 'https://incubator.apache.org/' },
	{ label: 'License', href: 'https://www.apache.org/licenses/' },
	{ label: 'Events', href: 'https://www.apache.org/events/current-event.html' },
	{ label: 'Security', href: 'https://www.apache.org/security/' },
	{ label: 'Sponsorship', href: 'https://www.apache.org/foundation/sponsorship.html' },
	{ label: 'Privacy', href: 'https://privacy.apache.org/policies/privacy-policy-public.html' },
	{ label: 'Thanks', href: 'https://www.apache.org/foundation/thanks.html' },
	{ label: 'Code of Conduct', href: 'https://www.apache.org/foundation/policies/conduct.html' }
];

const config: Config = {
	title: 'Apache Asyncband (Incubating)',
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

	plugins: [
		[
			'./plugins/blog.ts',
			{
				blogTitle: 'Engineering Blog',
				blogDescription:
					'Field guides and design notes on async coordination contracts, channel backpressure, and production Rust concurrency.',
				blogSidebarCount: 0
			}
		]
	],

	presets: [
		[
			'classic',
			{
				docs: false,
				blog: false,
				theme: {
					customCss: './src/css/custom.css'
				}
			} satisfies PresetOptions
		]
	],

	themeConfig: {
		image: 'og.png',
		colorMode: {
			defaultMode: 'light',
			disableSwitch: false,
			respectPrefersColorScheme: true
		},
		navbar: {
			title: 'Apache Asyncband',
			logo: {
				alt: 'Apache Asyncband',
				src: 'img/logo.svg',
				srcDark: 'img/logo-dark.svg',
				width: 28,
				height: 28
			},
			items: [
				{ to: '/downloads', label: 'Downloads', position: 'left' },
				{ to: '/blog', label: 'Blog', position: 'left' },
				{ to: '/community', label: 'Community', position: 'left' },
				{ href: 'https://docs.rs/asyncband/', label: 'API Docs', position: 'right' },
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
			style: 'light',
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
						{ label: 'About', to: '/' },
						{ label: 'Downloads', to: '/downloads' },
						{ label: 'Blog', to: '/blog' },
						{ label: 'API Docs', href: 'https://docs.rs/asyncband/' }
					]
				},
				{
					title: 'Community',
					items: [
						{ label: 'Community Guide', to: '/community' },
						{
							label: 'Mailing List',
							href: 'https://lists.apache.org/list.html?dev@asyncband.apache.org'
						},
						{ label: 'GitHub', href: 'https://github.com/apache/asyncband' },
						{ label: 'Issue Tracker', href: 'https://github.com/apache/asyncband/issues' }
					]
				},
				{ title: 'ASF', items: asfLinks }
			],
			copyright: `Apache Asyncband (Incubating) is an effort undergoing incubation at the Apache Software Foundation (ASF), sponsored by the <a href="https://incubator.apache.org/">Apache Incubator PMC</a>. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.<br/><br/>Copyright © 2025–${new Date().getFullYear()} The Apache Software Foundation. Licensed under the Apache License, Version 2.0.<br/>Apache Asyncband, Asyncband, Apache, the Apache feather logo, and the Apache Incubator project logo are either registered trademarks or trademarks of The Apache Software Foundation in the United States and/or other countries. All other marks mentioned may be trademarks or registered trademarks of their respective owners.`
		},
		prism: {
			theme: themes.github,
			darkTheme: themes.dracula,
			additionalLanguages: ['rust', 'bash', 'toml']
		}
	} satisfies ThemeConfig
};

export default config;
