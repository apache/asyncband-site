// Scans the production build output for load-bearing references to third-party
// hosts. ASF privacy policy requires every font, script, style, and image the
// page loads at runtime to be self-hosted; plain hyperlinks to external sites
// remain allowed.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const buildDir = path.join(siteDir, 'build');

const ALLOWED_HOSTS = new Set([
	'asyncband.apache.org',
	'www.w3.org' // xmlns in inline SVG
]);

const errors = [];

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);
		if (statSync(full).isDirectory()) {
			yield* walk(full);
		} else if (/\.(html|css|js)$/.test(entry)) {
			yield full;
		}
	}
}

const PATTERNS = [
	/\bsrc="(https?:\/\/[^"/]+)/g,
	/\bhref="(https?:\/\/[^"/]+)[^"]*"[^>]*\brel="(?:stylesheet|preconnect|dns-prefetch|preload|prefetch)"/g,
	/\brel="(?:stylesheet|preconnect|dns-prefetch|preload|prefetch)"[^>]*\bhref="(https?:\/\/[^"/]+)/g,
	/url\(\s*["']?(https?:\/\/[^"')/]+)/g,
	/@import\s+["'](https?:\/\/[^"'/]+)/g
];

for (const file of walk(buildDir)) {
	const content = readFileSync(file, 'utf8');
	for (const pattern of PATTERNS) {
		for (const match of content.matchAll(pattern)) {
			const rawUrl = match[1];
			const host = new URL(rawUrl).host;
			if (!ALLOWED_HOSTS.has(host)) {
				errors.push(`${path.relative(buildDir, file)}: load-bearing reference to ${host}`);
			}
		}
	}
}

if (errors.length > 0) {
	console.error(`external-asset check failed with ${errors.length} finding(s):`);
	for (const error of [...new Set(errors)].slice(0, 50)) {
		console.error(`  - ${error}`);
	}
	process.exit(1);
}

console.log('external-asset check passed: no third-party runtime assets.');
