import { fetch, FetchMethods, FetchResultTypes } from "@sapphire/fetch";
import { APIS } from "./enums";
import {
	type List,
	type DlistOptions,
	type ValorantAccount,
	type ValorantResult,
	type ValorantRegions,
	type ValorantMMR,
} from "../types/apis";

export class Valorant {
	baseUrl: string;
	constructor() {
		this.baseUrl = APIS.VALORANT;
	}

	public async account(name: string, tag: string) {
		return fetch<ValorantResult<ValorantAccount>>(
			`${this.baseUrl}/v1/account/${name}/${tag}`,
			FetchResultTypes.JSON,
		);
	}

	public async mmr(region: ValorantRegions, name: string, tag: string) {
		return fetch<ValorantResult<ValorantMMR>>(
			`${this.baseUrl}/v2/mmr/${region}/${name}/${tag}`,
			FetchResultTypes.JSON,
		);
	}
}

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
		return fetch<List>(
			`${this.baseUrl}/define?term=${term}`,
			FetchResultTypes.JSON,
		);
	}
}

export class PXLAPI {
	key: string;
	baseUrl: string;
	constructor(key: string) {
		this.key = key;
		this.baseUrl = APIS.PXLAPI;
	}

	public async imagescript(code: string, inject?: Record<string, unknown>) {
		return fetch(
			`${this.baseUrl}/imagescript/latest`,
			{
				method: FetchMethods.Post,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Application ${this.key}`,
				},
				body: JSON.stringify({
					code: String.raw`${code}`,
					inject,
				}),
			},
			FetchResultTypes.Buffer,
		);
	}
}

/**
 * A wrapper for the discordlist.gg api
 * @author brxem
 */
export class Dlist {
	options: DlistOptions;
	url: string;
	constructor(options: DlistOptions) {
		this.options = options;
		this.url = APIS.DLIST;
	}

	public async postGuildCount(count: number) {
		return await fetch<boolean>(
			`${this.url}/bots/${this.options.id}/stats`,
			{
				method: FetchMethods.Post,
				headers: {
					Authorization: this.parseBodyToken(),
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify({
					server_count: count,
				}),
			},
			FetchResultTypes.JSON,
		);
	}

	private parseBodyToken() {
		return `Bearer ${this.options.token}`;
	}
}
