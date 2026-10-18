// Builds the favicon set in public/ from src/assets/icon.png.
// Run `npm run favicons` after replacing the source icon.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('../src/assets/icon.png', import.meta.url));
const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

// iOS fills transparent pixels with black, so the touch icon gets the site's
// dark background instead.
const APPLE_BACKGROUND = '#111110';

const resized = (size) => sharp(src).resize(size, size);

// An ICO can hold PNGs directly, which every current browser reads.
function ico(images) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);

	let offset = header.length + 16 * images.length;
	const entries = images.map(({ size, data }) => {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size, 0); // width
		entry.writeUInt8(size, 1); // height
		entry.writeUInt16LE(1, 4); // color planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += data.length;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
}

const icoImages = await Promise.all(
	[16, 32, 48].map(async (size) => ({ size, data: await resized(size).png().toBuffer() })),
);
await writeFile(out('favicon.ico'), ico(icoImages));
await resized(192).png().toFile(out('icon-192.png'));
await resized(180).flatten({ background: APPLE_BACKGROUND }).png().toFile(out('apple-touch-icon.png'));

console.log('Wrote favicon.ico, icon-192.png and apple-touch-icon.png to public/');
