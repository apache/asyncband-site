import blogPlugin, { type PluginOptions } from '@docusaurus/plugin-content-blog';
import type { LoadContext } from '@docusaurus/types';

export { validateOptions } from '@docusaurus/plugin-content-blog';

export default async function blog(context: LoadContext, options: PluginOptions) {
	const plugin = await blogPlugin(context, options);
	const contentLoaded = plugin.contentLoaded!;

	// Resolve avatars before Docusaurus emits HTML and client-side data.
	plugin.contentLoaded = async (args) => {
		const authors = [
			...Object.values(args.content.authorsMap ?? {}),
			...args.content.blogPosts.flatMap((post) => post.metadata.authors)
		];
		const images = new Map<string, string>();
		for (const author of authors) {
			const url = author.imageURL;
			if (!url || !/^https?:\/\//.test(url)) continue;
			if (!images.has(url)) {
				const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
				if (!response.ok) throw new Error(`Failed to fetch avatar ${url}: ${response.status}`);
				const contentType = response.headers.get('content-type');
				if (!contentType?.startsWith('image/')) {
					throw new Error(`Expected an image from ${url}, got ${contentType}`);
				}
				const image = Buffer.from(await response.arrayBuffer()).toString('base64');
				images.set(url, `data:${contentType};base64,${image}`);
			}
			author.imageURL = images.get(url);
		}
		await contentLoaded(args);
	};
	return plugin;
}
