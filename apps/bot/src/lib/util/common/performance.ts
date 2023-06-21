export function cdn(url: string) {
	const optimisedUrl = new URL(
		url.replace("raw.githubusercontent.com", "rawcdn.githack.com")
	);
	optimisedUrl.searchParams.append("min", "1");

	return optimisedUrl.toString();
}

export function randomID() {
	return (Math.random() + 1).toString(36).substring(2);
}

export function optimalFileName(format: string) {
	return `${randomID()}.${format}`;
}
