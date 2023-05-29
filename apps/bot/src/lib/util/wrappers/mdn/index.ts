import type { MdnAPI } from "./types";
import { FetchResultTypes, fetch } from "@sapphire/fetch";

export class MDN {
	private readonly url: string = "https://developer.mozilla.org";

	public async search(query: string, hitsPerPage = 25) {
		const fullUrl = new URL(`${this.url}/api/v1/search`);
		fullUrl.searchParams.append("q", query);
		fullUrl.searchParams.append("size", hitsPerPage.toString());

		return fetch<MdnAPI>(
			fullUrl,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
			FetchResultTypes.JSON,
		);
	}
}
