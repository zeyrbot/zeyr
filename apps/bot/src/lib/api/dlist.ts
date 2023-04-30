import type { Nullable } from "../../lib/types/generic";
import { fetch, FetchMethods, FetchResultTypes } from "@sapphire/fetch";

/**
 * A wrapper for the discordlist.gg api
 * @author brxem
 */
export class Dlist {
	options: DlistOptions;
	url: string;
	constructor(options: DlistOptions) {
		this.options = options;
		this.url = "https://api.discordlist.gg/v0";
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

export type DlistOptions = {
	id: string;
	token: string;
};
export interface GetBotResults {
	allTimeVotes: string;
	avatar: string;
	briefDescription: string;
	coOwnerIds: string[];
	createdOn: string;
	discriminator: number;
	features: string;
	flags: string;
	guildCount: Nullable<string>;
	id: string;
	instagramUrl: Nullable<string>;
	inviteUrl: string;
	isForcedIntoHiding: boolean;
	isHidden: boolean;
	isPackable: boolean;
	longDescription: string;
	ownerId: string;
	prefix: string;
	repoUrl: string;
	slug: Nullable<string>;
	supportServerUrl: string;
	tags: string[];
	twitterUrl: Nullable<string>;
	username: string;
	votes: string;
	websiteUrl: Nullable<string>;
}
