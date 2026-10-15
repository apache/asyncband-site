import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const imageExtensions = new Map([
	['image/png', '.png'],
	['image/jpeg', '.jpg'],
	['image/gif', '.gif'],
	['image/webp', '.webp'],
	['image/avif', '.avif'],
	['image/svg+xml', '.svg']
]);

export async function prepareAuthors(siteDir) {
	const authors = load(await readFile(join(siteDir, 'blog/authors.yml'), 'utf8'));
	const generatedDir = join(siteDir, '.docusaurus/blog-authors');
	const avatarsDir = join(generatedDir, 'static/avatars');
	await rm(generatedDir, { recursive: true, force: true });
	await mkdir(avatarsDir, { recursive: true });

	for (const [key, author] of Object.entries(authors)) {
		const source = author.image_url;
		if (!source || !/^(https?:)?\/\//i.test(source)) continue;

		try {
			const response = await fetch(source.startsWith('//') ? `https:${source}` : source, {
				signal: AbortSignal.timeout(15_000),
				cache: 'no-cache'
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const contentType = response.headers.get('content-type')?.split(';')[0].trim();
			const extension = imageExtensions.get(contentType);
			if (!extension) throw new Error(`Unsupported image content type: ${contentType}`);
			const image = Buffer.from(await response.arrayBuffer());
			if (!image.length) throw new Error('Empty image');
			const filename = `${createHash('sha256').update(image).digest('hex')}${extension}`;
			await writeFile(join(avatarsDir, filename), image);
			author.image_url = `/avatars/${filename}`;
		} catch (error) {
			throw new Error(`Could not prepare avatar for ${key}: ${source}`, { cause: error });
		}
	}

	await writeFile(join(generatedDir, 'authors.json'), `${JSON.stringify(authors, null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await prepareAuthors(fileURLToPath(new URL('../', import.meta.url)));
}
