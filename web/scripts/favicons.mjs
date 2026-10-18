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

// The icon's gray disc is partly see-through, so it fades into dark tab bars
// and only the skull shows. A solid disc of the same gray goes underneath.
const DISC = { radius: 0.48, color: '#4b4a47' };

// Zoom in on the skull, hat and pipe so they fill the tab like other sites'
// icons do; the disc's edge is cropped off. Fractions of the source size.
const CROP = { left: 0.1375, top: 0.07, size: 0.7875 };

const { width: sourceSize } = await sharp(src).metadata();
const disc = `<svg xmlns="http://www.w3.org/2000/svg" width="${sourceSize}" height="${sourceSize}">
	<circle cx="50%" cy="50%" r="${DISC.radius * sourceSize}" fill="${DISC.color}"/>
</svg>`;
// sharp crops before compositing, so the layers are flattened first.
const layered = await sharp(Buffer.from(disc)).composite([{ input: src }]).png().toBuffer();
const artwork = await sharp(layered)
	.extract({
		left: Math.round(CROP.left * sourceSize),
		top: Math.round(CROP.top * sourceSize),
		width: Math.round(CROP.size * sourceSize),
		height: Math.round(CROP.size * sourceSize),
	})
	.png()
	.toBuffer();

const resized = (size) => sharp(artwork).resize(size, size);

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
