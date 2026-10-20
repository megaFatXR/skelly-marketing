// Renders every screen in screens.html, in every language in copy.js, at the
// two iPhone sizes App Store Connect takes:
//
//   export/<lang>/iphone-medium/  1206 × 2622, the 6.1"/6.3" size it requires
//   export/<lang>/iphone-large/   1320 × 2868, the optional 6.9" size
//
// and, for each language with its own iPad captures (captures/<lang>/ipad/),
//
//   export/<lang>/ipad/           2064 × 2752, the 13" iPad size it requires
//
// and header.html to export/en/header.png, the 21:9 product page header at
// 3840 × 1646. Every language uses the English header, so only English
// renders it. App Store Connect takes only PNG there, without an alpha
// channel, and full compression keeps it well under the 10 MB a browser
// upload allows (the default level makes it 13 MB).
//
//   npm run export           every language
//   npm run export -- en fr  just these
//
// Uses the installed Google Chrome; set CHROME_PATH to use another.
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const CHROME =
	process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// The screens are 440 × 956 CSS px, so 3× lands exactly on the large size.
// The medium size is the same render scaled down: its shape differs by under
// a pixel, which `cover` trims off the edge.
const SCALE = 3;
const SIZES = {
	'iphone-large': { width: 1320, height: 2868 },
	'iphone-medium': { width: 1206, height: 2622 },
};

// The iPad screens are 1032 × 1376 CSS px, so 2× lands exactly on 2064 × 2752.
const IPAD_SCALE = 2;
const IPAD_SIZE = { width: 2064, height: 2752 };
const hasIpadCaptures = (lang) => existsSync(new URL(`captures/${lang}/ipad/`, import.meta.url));

// The header is 1920 × 823 CSS px, so 2× lands exactly on Apple's size.
const HEADER_SCALE = 2;
const HEADER_SIZE = { width: 3840, height: 1646 };

const pageUrl = (file, lang, device) => {
	const url = pathToFileURL(fileURLToPath(new URL(file, import.meta.url)));
	url.searchParams.set('lang', lang);
	if (device) url.searchParams.set('device', device);
	return url.href;
};
const screensUrl = (lang) => pageUrl('screens.html', lang);
const outDir = (lang, size = '') =>
	fileURLToPath(new URL(`export/${lang}/${size && `${size}/`}`, import.meta.url));

const browser = await puppeteer.launch({ executablePath: CHROME });
let failed = false;

try {
	const page = await browser.newPage();
	await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: SCALE });
	const ipadPage = await browser.newPage();
	await ipadPage.setViewport({ width: 2400, height: 1600, deviceScaleFactor: IPAD_SCALE });
	const headerPage = await browser.newPage();
	await headerPage.setViewport({ width: 2000, height: 1000, deviceScaleFactor: HEADER_SCALE });
	// Element screenshots stall on a background tab, so each page is brought
	// to the front before it's captured.

	// The language list lives in copy.js, so ask the page for it.
	await page.goto(screensUrl('en'), { waitUntil: 'load' });
	const available = await page.evaluate(() => Object.keys(window.COPY));
	const asked = process.argv.slice(2);
	const unknown = asked.filter((lang) => !available.includes(lang));
	if (unknown.length) throw new Error(`No copy for ${unknown.join(', ')} in copy.js`);
	const langs = asked.length ? asked : available;

	for (const lang of langs) {
		await page.bringToFront();
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

		// Start from empty folders so a screen that's been removed doesn't linger.
		await rm(outDir(lang), { recursive: true, force: true });
		for (const size of Object.keys(SIZES)) await mkdir(outDir(lang, size), { recursive: true });

		for (const screen of await page.$$('.screen')) {
			const name = await screen.evaluate((el) => el.dataset.name);
			const render = await screen.screenshot();

			const results = [];
			for (const [size, { width, height }] of Object.entries(SIZES)) {
				const file = `${outDir(lang, size)}${name}.png`;
				const info = await sharp(render).resize(width, height, { fit: 'cover' }).png().toFile(file);
				const ok = info.width === width && info.height === height;
				if (!ok) failed = true;
				results.push(`${ok ? '✓' : '✗'} ${info.width} × ${info.height}`);
			}
			console.log(`  ${name}.png  ${results.join('  ')}`);
		}

		if (hasIpadCaptures(lang)) {
			await ipadPage.bringToFront();
			await ipadPage.goto(pageUrl('screens.html', lang, 'ipad'), { waitUntil: 'load' });
			const ipadReport = await ipadPage.evaluate(() => window.screensReady);
			if (ipadReport.brokenCaptures.length) {
				console.log(`  ✗ Missing iPad captures: ${ipadReport.brokenCaptures.join(', ')}`);
				failed = true;
			} else {
				await mkdir(outDir(lang, 'ipad'), { recursive: true });
				for (const screen of await ipadPage.$$('.screen')) {
					const name = await screen.evaluate((el) => el.dataset.name);
					const info = await sharp(await screen.screenshot())
						.png()
						.toFile(`${outDir(lang, 'ipad')}${name}.png`);
					const ok = info.width === IPAD_SIZE.width && info.height === IPAD_SIZE.height;
					if (!ok) failed = true;
					console.log(`  ipad/${name}.png  ${ok ? '✓' : '✗'} ${info.width} × ${info.height}`);
				}
			}
		}

		if (lang !== 'en') continue;
		await headerPage.bringToFront();
		await headerPage.goto(pageUrl('header.html', lang), { waitUntil: 'load' });
		await headerPage.evaluate(() => window.screensReady);
		const render = await (await headerPage.$('.header')).screenshot();
		const info = await sharp(render)
			.removeAlpha()
			.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
			.toFile(`${outDir(lang)}header.png`);
		const ok = info.width === HEADER_SIZE.width && info.height === HEADER_SIZE.height;
		if (!ok) failed = true;
		console.log(`  header.png  ${ok ? '✓' : '✗'} ${info.width} × ${info.height}  ${(info.size / 1e6).toFixed(1)} MB`);
	}
} finally {
	await browser.close();
}

if (failed) {
	console.error('\nSome screens failed; see ✗ above.');
	process.exit(1);
}
console.log('\nDone: app-store/export/');
