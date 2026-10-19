// Saves what the simulator shows to captures/<lang>/<name>.png, with a clean
// status bar (9:41, full signal, full battery). It uses the "Skelly
// Screenshots" simulator from `npm run sim` when that's running, or else
// whichever simulator is booted.
//
//   npm run capture -- home      → captures/en/home.png
//   npm run capture -- home fr   → captures/fr/home.png
import { mkdirSync, readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { cleanStatusBar, findDevice, simctl } from './simulator.mjs';

const [arg, lang = 'en'] = process.argv.slice(2);
if (!arg) {
	console.error('Usage: npm run capture -- <name> [lang]');
	process.exit(1);
}
const name = arg.replace(/\.png$/, '');

const device = findDevice();
const udid = device?.state === 'Booted' ? device.udid : 'booted';

// The override stays on until `xcrun simctl status_bar booted clear`.
cleanStatusBar(udid);
// Give the status bar a moment to redraw.
await sleep(1000);

const dir = fileURLToPath(new URL(`captures/${lang}/`, import.meta.url));
mkdirSync(dir, { recursive: true });
simctl('io', udid, 'screenshot', `${dir}${name}.png`);
console.log(`Saved captures/${lang}/${name}.png`);

const used = readFileSync(new URL('screens.html', import.meta.url), 'utf8').matchAll(/data-capture="([^"]+)"/g);
if (![...used].some(([, file]) => file === `${name}.png`)) {
	console.log(`Note: screens.html doesn't use ${name}.png yet.`);
}
