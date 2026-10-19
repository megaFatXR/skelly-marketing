// Renders every screen in screens.html, in every language in copy.js, to
// export/<lang>/<name>.png at 1320 × 2868, the 6.9" iPhone size that App Store
// Connect scales down for every smaller iPhone.
//
//   npm run export           every language
//   npm run export -- en fr  just these
//
// Uses the installed Google Chrome; set CHROME_PATH to use another.
import { mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const CHROME =
	process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// The screens are 440 × 956 CSS px, so 3× lands exactly on Apple's size.
const SCALE = 3;
const SIZE = { width: 1320, height: 2868 };

const screensUrl = (lang) => {
	const url = pathToFileURL(fileURLToPath(new URL('screens.html', import.meta.url)));
	url.searchParams.set('lang', lang);
	return url.href;
};
const outDir = (lang) => fileURLToPath(new URL(`export/${lang}/`, import.meta.url));

// A PNG's width and height sit at bytes 16–23 of its header.
async function pngSize(file) {
	const header = (await readFile(file)).subarray(0, 24);
	return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

const browser = await puppeteer.launch({ executablePath: CHROME });
let failed = false;

try {
	const page = await browser.newPage();
	await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: SCALE });

	// The language list lives in copy.js, so ask the page for it.
	await page.goto(screensUrl('en'), { waitUntil: 'load' });
	const available = await page.evaluate(() => Object.keys(window.COPY));
	const asked = process.argv.slice(2);
	const unknown = asked.filter((lang) => !available.includes(lang));
	if (unknown.length) throw new Error(`No copy for ${unknown.join(', ')} in copy.js`);
	const langs = asked.length ? asked : available;

	for (const lang of langs) {
		await page.goto(screensUrl(lang), { waitUntil: 'load' });
		const report = await page.evaluate(() => window.screensReady);

		console.log(`\n${lang}`);
		if (report.missingCopy.length)
			console.log(`  ! English copy for ${report.missingCopy.join(', ')}`);
		if (report.englishCaptures.length)
			console.log(`  ! English captures for ${report.englishCaptures.join(', ')}`);
		if (report.brokenCaptures.length) {
			console.log(`  ✗ Missing captures: ${report.brokenCaptures.join(', ')} (skipped ${lang})`);
			failed = true;
			continue;
		}

		// Start from an empty folder so a screen that's been removed doesn't linger.
		await rm(outDir(lang), { recursive: true, force: true });
		await mkdir(outDir(lang), { recursive: true });
		for (const screen of await page.$$('.screen')) {
			const name = await screen.evaluate((el) => el.dataset.name);
			const file = `${outDir(lang)}${name}.png`;
			await screen.screenshot({ path: file });

			const { width, height } = await pngSize(file);
			const ok = width === SIZE.width && height === SIZE.height;
			if (!ok) failed = true;
			console.log(`  ${ok ? '✓' : '✗'} ${name}.png  ${width} × ${height}`);
		}
	}
} finally {
	await browser.close();
}

if (failed) {
	console.error('\nSome screens failed; see ✗ above.');
	process.exit(1);
}
console.log('\nDone: app-store/export/');
