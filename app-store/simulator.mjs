// The simulators the captures come from: a dedicated iPhone 17 Pro and iPad
// Pro 13", so resetting them per region leaves your own simulators alone.
import { execFileSync } from 'node:child_process';

export const DEVICES = {
	iphone: { name: 'Skelly Screenshots', type: 'com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro' },
	ipad: {
		name: 'Skelly Screenshots iPad',
		type: 'com.apple.CoreSimulator.SimDeviceType.iPad-Pro-13-inch-M5-12GB',
	},
};

/** "ipad" when the arguments include --ipad, else "iphone"; and the rest. */
export function parseDevice(args) {
	return { kind: args.includes('--ipad') ? 'ipad' : 'iphone', rest: args.filter((a) => a !== '--ipad') };
}

export const simctl = (...args) =>
	execFileSync('xcrun', ['simctl', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

const devices = () =>
	Object.values(JSON.parse(simctl('list', 'devices', '--json')).devices).flat();

/** The screenshots simulator, or undefined if it hasn't been created yet. */
export const findDevice = (kind = 'iphone') => devices().find((device) => device.name === DEVICES[kind].name);

/** The screenshots simulator, created on the newest iOS if it's missing. */
export function ensureDevice(kind = 'iphone') {
	const existing = findDevice(kind);
	if (existing) return existing;

	const runtime = JSON.parse(simctl('list', 'runtimes', '--json'))
		.runtimes.filter((r) => r.platform === 'iOS' && r.isAvailable)
		.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
		.at(-1);
	if (!runtime) throw new Error('No iOS simulator runtime installed (Xcode › Settings › Components)');
	simctl('create', DEVICES[kind].name, DEVICES[kind].type, runtime.identifier);
	return findDevice(kind);
}

/** Apple's clean status bar: 9:41, full signal, full battery. */
export function cleanStatusBar(udid) {
	simctl(
		'status_bar', udid, 'override',
		'--time', '9:41',
		'--dataNetwork', 'wifi', '--wifiMode', 'active', '--wifiBars', '3',
		'--cellularMode', 'active', '--cellularBars', '4',
		'--batteryState', 'discharging', '--batteryLevel', '100',
	);
}
