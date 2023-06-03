import { APIS } from "../../common/enums";
import type {
	ApexPlatforms,
	ApexProfile,
	CSGOPlatforms,
	TrackerRoot
} from "./types";
import { FetchResultTypes, fetch } from "@sapphire/fetch";

export class Tracker {
	baseUrl: string;
	private readonly key: string;
	constructor(key: string) {
		this.baseUrl = APIS.TRACKERGG;
		this.key = key;
	}

	public async apexProfile(platform: ApexPlatforms, id: string) {
		return fetch<TrackerRoot<ApexProfile>>(
			`${this.baseUrl}/apex/standard/profile/${platform}/${id}`,
			{
				headers: {
					"TRN-Api-Key": this.key!,
					"Content-Type": "application/json"
				}
			},
			FetchResultTypes.JSON
		);
	}

	public async csgoProfile(platform: CSGOPlatforms, id: string) {
		return fetch<TrackerRoot<ApexProfile>>(
			//WIPPPPPPPPPPPPPppp
			`${this.baseUrl}/csgo/standard/profile/${platform}/${id}`,
			{
				headers: {
					"TRN-Api-Key": this.key!,
					"Content-Type": "application/json"
				}
			},
			FetchResultTypes.JSON
		);
	}
}
