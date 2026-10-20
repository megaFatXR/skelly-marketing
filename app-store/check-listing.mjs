// Checks every listing/<lang>.json against App Store Connect's limits.
//
//   npm run listing
import { readdir, readFile } from 'node:fs/promises';

const LIMITS = { name: 30, subtitle: 30, promotionalText: 170, description: 4000, keywords: 100 };
const dir = new URL('listing/', import.meta.url);
let failed = false;

for (const file of (await readdir(dir)).filter((f) => f.endsWith('.json')).sort()) {
	const listing = JSON.parse(await readFile(new URL(file, dir), 'utf8'));
	const counts = Object.entries(LIMITS).map(([field, max]) => {
		// Apple counts characters, so count code points rather than UTF-16 units.
		const length = [...(listing[field] ?? '')].length;
		const ok = length > 0 && length <= max;
		if (!ok) failed = true;
		return `${ok ? '✓' : '✗'} ${field} ${length}/${max}`;
	});
	console.log(`${file.replace('.json', '').padEnd(3)} ${counts.join('  ')}`);
}

if (failed) process.exit(1);
