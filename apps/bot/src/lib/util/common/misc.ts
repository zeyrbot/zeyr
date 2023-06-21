import { ok } from "./discord";

export function timedText(time: string) {
	return ok("Job completed, took !{}", time);
}

export function format(format: string, ...args: string[]): string {
	let index = 0;
	return format.replace(/!{.*}|{.*}/g, () => args[index++]);
}
