export function optimiseGithubCDN(url: string) {
	const optimisedUrl = new URL(
		url.replace("raw.githubusercontent.com", "rawcdn.githack.com"),
	);
	optimisedUrl.searchParams.append("min", "1");

	return optimisedUrl.toString();
}
