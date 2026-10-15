import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { dump } from 'js-yaml';
import { prepareAuthors } from './prepare-authors.mjs';

async function fixture(t, handler) {
	const siteDir = await mkdtemp(join(tmpdir(), 'asyncband-authors-'));
	t.after(() => rm(siteDir, { recursive: true, force: true }));
	await mkdir(join(siteDir, 'blog'));
	const server = createServer(handler);
	server.listen(0, '127.0.0.1');
	await once(server, 'listening');
	t.after(() => new Promise((resolve) => server.close(resolve)));
	const source = `http://127.0.0.1:${server.address().port}/avatar.png`;
	const authors = {
		remote: { name: 'Remote author', image_url: source },
		local: { name: 'Local author', image_url: '/local.png' },
		text: { name: 'Author without an avatar' }
	};
	const input = dump(authors);
	await writeFile(join(siteDir, 'blog/authors.yml'), input);
	const generatedDir = join(siteDir, '.docusaurus/blog-authors');
	const readAuthors = async () =>
		JSON.parse(await readFile(join(generatedDir, 'authors.json'), 'utf8'));
	return { siteDir, source, authors, input, generatedDir, readAuthors };
}

test('refreshes a changed avatar at the same URL before generating author data', async (t) => {
	let image = '<svg xmlns="http://www.w3.org/2000/svg"><text>First avatar</text></svg>';
	const fixtureData = await fixture(t, (request, response) => {
		if (request.url === '/avatar.png') {
			response.writeHead(302, { Location: '/image' }).end();
		} else {
			response.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' }).end(image);
		}
	});
	const { siteDir, authors, input, generatedDir, readAuthors } = fixtureData;
	await prepareAuthors(siteDir);
	const first = await readAuthors();
	assert.match(first.remote.image_url, /^\/avatars\/.*\.svg$/);
	assert.equal(await readFile(join(generatedDir, 'static', first.remote.image_url), 'utf8'), image);

	image = '<svg xmlns="http://www.w3.org/2000/svg"><text>New avatar</text></svg>';
	await prepareAuthors(siteDir);
	const second = await readAuthors();
	assert.notEqual(second.remote.image_url, first.remote.image_url);
	assert.equal(
		await readFile(join(generatedDir, 'static', second.remote.image_url), 'utf8'),
		image
	);
	assert.equal(second.remote.name, authors.remote.name);
	assert.deepEqual(second.local, authors.local);
	assert.deepEqual(second.text, authors.text);
	assert.equal(await readFile(join(siteDir, 'blog/authors.yml'), 'utf8'), input);
});

for (const { name, status, contentType, body } of [
	{ name: 'HTTP failure', status: 503, contentType: 'text/plain', body: 'Unavailable' },
	{ name: 'non-image response', status: 200, contentType: 'text/html', body: '<h1>Error</h1>' },
	{ name: 'empty image', status: 200, contentType: 'image/png', body: '' }
]) {
	test(`fails preparation on ${name} instead of publishing an external avatar`, async (t) => {
		const { siteDir, source, readAuthors } = await fixture(t, (_request, response) => {
			response.writeHead(status, { 'Content-Type': contentType }).end(body);
		});
		await assert.rejects(prepareAuthors(siteDir), (error) => error.message.includes(source));
		await assert.rejects(readAuthors(), { code: 'ENOENT' });
	});
}
