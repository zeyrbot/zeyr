import { APIS } from "../../common/enums";
import type { UrbanList } from "./types";
import { FetchResultTypes, fetch } from "@sapphire/fetch";

export class Urbandictionary {
	baseUrl: string;
	constructor() {
		this.baseUrl = APIS.URBANDICTIONARY;
	}

	public async autocomplete(term: string) {
		return fetch<string[]>(
			`${this.baseUrl}/autocomplete?term=${term}`,
			FetchResultTypes.JSON,
		);
	}

	public async define(term: string) {
		return fetch<UrbanList>(
			`${this.baseUrl}/define?term=${term}`,
			FetchResultTypes.JSON,
		);
	}
}
