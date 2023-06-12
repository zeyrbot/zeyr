import { ok } from "./discord";

export function timedText(
	time: string,
	...content: readonly (string | number)[]
) {
	return ok(...content, "took", time);
}
