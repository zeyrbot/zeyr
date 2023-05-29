import { APIS } from "../../common/enums";
import { FetchMethods, FetchResultTypes, fetch } from "@sapphire/fetch";

export class Dlist {
	id: string;
	key?: string;
	baseUrl: string;
	constructor(id: string, key: string) {
		this.id = id;
		this.key = key;
		this.baseUrl = APIS.DLIST;
	}

	public async postGuildCount(count: number) {
		return await fetch<boolean>(
			`${this.baseUrl}/bots/${this.id}/stats`,
			{
				method: FetchMethods.Post,
				headers: this.headers,
				body: JSON.stringify({
					server_count: count,
				}),
			},
			FetchResultTypes.JSON,
		);
	}

	private headers = {
		Authorization: `Bearer ${this.key}`,
		"Content-Type": "application/json; charset=utf-8",
	};
}
