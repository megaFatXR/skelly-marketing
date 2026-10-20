// Prints the callout numbers (--x, --y, --w, --h as fractions of the capture)
// for the gold Bare Bones button in a page capture, to paste into
// screens.html after re-capturing.
//
//   npm run measure -- captures/en/page.png
//   npm run measure -- captures/en/ipad/page.png
import sharp from 'sharp';

const file = process.argv[2];
if (!file) {
	console.error('Usage: npm run measure -- <capture.png>');
	process.exit(1);
}

// The app's gold (BrandHighlight), and how far a pixel may stray from it.
const GOLD = [252, 180, 47];
const TOLERANCE = 60;

const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// The button sits in the toolbar, in the bottom tenth of the screen. Only rows
// with a wide run of gold count, which leaves out the gold bookmark star in
// the address bar above it.
let minX = width, minY = height, maxX = -1, maxY = -1;
for (let y = Math.floor(height * 0.9); y < height; y++) {
	const gold = [];
	for (let x = 0; x < width; x++) {
		const i = (y * width + x) * channels;
		const off = Math.abs(data[i] - GOLD[0]) + Math.abs(data[i + 1] - GOLD[1]) + Math.abs(data[i + 2] - GOLD[2]);
		if (off < TOLERANCE) gold.push(x);
	}
	if (gold.length < width * 0.1) continue;
	minX = Math.min(minX, gold[0]);
	maxX = Math.max(maxX, gold.at(-1));
	minY = Math.min(minY, y);
	maxY = Math.max(maxY, y);
}

if (maxX < 0) {
	console.error('No gold button found in the bottom of the capture.');
	process.exit(1);
}

const f = (n) => n.toFixed(4);
console.log(
	`--x: ${f(minX / width)}; --y: ${f(minY / height)}; --w: ${f((maxX - minX + 1) / width)}; --h: ${f((maxY - minY + 1) / height)}`,
);
