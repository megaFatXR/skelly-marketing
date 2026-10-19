// Gets the "Skelly Screenshots" simulator ready to capture a region: builds
// Skelly, sets the simulator's region and language, and installs the app
// fresh, so it opens as on first launch with that region's sites preloaded.
//
//   npm run sim -- US       United States, in English
//   npm run sim -- FR fr    France, in French
//
// Builds from ~/Workspace/Skelly, or the checkout in SKELLY_REPO.
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanStatusBar, DEVICE_NAME, ensureDevice, simctl } from './simulator.mjs';

const [region, language = 'en'] = process.argv.slice(2);
if (!/^[A-Z]{2}$/.test(region ?? '')) {
	console.error('Usage: npm run sim -- <REGION> [language], e.g. npm run sim -- US');
	process.exit(1);
}

const BUNDLE_ID = 'app.skelly';
const repo = process.env.SKELLY_REPO ?? join(homedir(), 'Workspace/Skelly');
const buildDir = fileURLToPath(new URL('.build/', import.meta.url));
const app = join(buildDir, 'Build/Products/Debug-iphonesimulator/SkeletonBrowser.app');

console.log(`Building Skelly from ${repo}…`);
execFileSync(
	'xcodebuild',
	[
		'-project', join(repo, 'ios/SkeletonBrowser.xcodeproj'),
		'-scheme', 'SkeletonBrowser',
		'-configuration', 'Debug',
		'-destination', 'generic/platform=iOS Simulator',
		'-derivedDataPath', buildDir,
		'-quiet',
		'build',
	],
	{ stdio: 'inherit' },
);

const { udid, state } = ensureDevice();

// The region and language are read when the simulator starts, so set them
// on a booted simulator and then restart it.
if (state !== 'Booted') simctl('bootstatus', udid, '-b');
simctl('spawn', udid, 'defaults', 'write', '-g', 'AppleLocale', '-string', `${language}_${region}`);
simctl('spawn', udid, 'defaults', 'write', '-g', 'AppleLanguages', '-array', `${language}-${region}`);
simctl('shutdown', udid);
simctl('bootstatus', udid, '-b');

// A fresh install has no home screen sites yet, so the app preloads the
// region's on first launch.
try {
	simctl('uninstall', udid, BUNDLE_ID);
} catch {}
simctl('install', udid, app);
cleanStatusBar(udid);
simctl('launch', udid, BUNDLE_ID);
execFileSync('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', udid]);

console.log(`\n${DEVICE_NAME} is on ${language}_${region} with a fresh Skelly.`);
console.log('Bring up a screen, then: npm run capture -- <name>');
