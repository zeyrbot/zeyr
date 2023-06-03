export const customId = (separator: string, ...args: readonly string[]) =>
	args.join(separator);

export async function secureFetch(url: string, init?: RequestInit) {
	const controller = new AbortController();
	const id = setTimeout(() => {
		controller.abort();
	}, 10000);

	const response = await fetch(url, {
		...init,
		signal: controller.signal
	});

	clearTimeout(id);
	return response;
}
