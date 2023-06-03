import { APIS } from "../../common/enums";
import type {
	ValorantAccount,
	ValorantMMR,
	ValorantRegions,
	ValorantRoot
} from "./types";
import { FetchResultTypes, fetch } from "@sapphire/fetch";

export class Valorant {
	baseUrl: string;
	key?: string;
	constructor(key?: string) {
		this.baseUrl = APIS.VALORANT;
		this.key = key;
	}

	public async account(name: string, tag: string) {
		return fetch<ValorantRoot<ValorantAccount>>(
			`${this.baseUrl}/v1/account/${name}/${tag}`,
			{
				headers: this.headers
			},
			FetchResultTypes.JSON
		);
	}

	public async mmr(region: ValorantRegions, name: string, tag: string) {
		return fetch<ValorantRoot<ValorantMMR>>(
			`${this.baseUrl}/v2/mmr/${region}/${name}/${tag}`,
			{
				headers: this.headers
			},
			FetchResultTypes.JSON
		);
	}

	public async crosshair(code: string) {
		return fetch(
			`${this.baseUrl}/v1/crosshair/generate?id=${code}`,
			{
				headers: this.headers
			},
			FetchResultTypes.Buffer
		);
	}

	private headers = {
		Authorization: this.key ?? ""
	};
}
