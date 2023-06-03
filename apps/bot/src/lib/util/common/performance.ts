export function cdn(url: string) {
	const optimisedUrl = new URL(
		url.replace("raw.githubusercontent.com", "rawcdn.githack.com")
	);
	optimisedUrl.searchParams.append("min", "1");

	return optimisedUrl.toString();
}

export function optimalFileName(format: string) {
	return `${(Math.random() + 1).toString(36).substring(2)}.${format}`;
}
