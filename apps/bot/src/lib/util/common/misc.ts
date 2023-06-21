import { ok } from "./discord";

export function timedText(time: string) {
	return ok("Job completed, took !{}", time);
}

export function format(format: string, ...args: string[]): string {
	let index = 0;
	return format.replace(/!{}|{}/g, () => args[index++]);
}

export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return "0 bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [" bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]].join("");
}
