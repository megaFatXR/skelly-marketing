// The simulator the captures come from: a dedicated "Skelly Screenshots"
// iPhone 17 Pro, so resetting it per region leaves your own simulators alone.
import { execFileSync } from 'node:child_process';

export const DEVICE_NAME = 'Skelly Screenshots';
const DEVICE_TYPE = 'com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro';

export const simctl = (...args) =>
	execFileSync('xcrun', ['simctl', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

const devices = () =>
	Object.values(JSON.parse(simctl('list', 'devices', '--json')).devices).flat();

/** The screenshots simulator, or undefined if it hasn't been created yet. */
export const findDevice = () => devices().find((device) => device.name === DEVICE_NAME);

/** The screenshots simulator, created on the newest iOS if it's missing. */
export function ensureDevice() {
	const existing = findDevice();
	if (existing) return existing;

	const runtime = JSON.parse(simctl('list', 'runtimes', '--json'))
		.runtimes.filter((r) => r.platform === 'iOS' && r.isAvailable)
		.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
		.at(-1);
	if (!runtime) throw new Error('No iOS simulator runtime installed (Xcode › Settings › Components)');
	simctl('create', DEVICE_NAME, DEVICE_TYPE, runtime.identifier);
	return findDevice();
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
