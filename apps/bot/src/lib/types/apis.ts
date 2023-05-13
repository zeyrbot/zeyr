import type { Nullable } from "./generic";

export type ValorantRegions = "ap" | "br" | "eu" | "kr" | "latam" | "na";

export interface ValorantResult<T> {
	status: number;
	data: T;
}

export interface ValorantMMR {
	name: string;
	tag: string;
	puuid: string;
	current_data: CurrentData;
	highest_rank: ValorantMMRHighestRank;
}

export interface CurrentData {
	currenttier: number;
	currenttierpatched: string;
	images: ValorantMMRImages;
	ranking_in_tier: number;
	mmr_change_to_last_game: number;
	elo: number;
	games_needed_for_rating: number;
	old: boolean;
}

export interface ValorantMMRImages {
	small: string;
	large: string;
	triangle_down: string;
	triangle_up: string;
}

export interface ValorantMMRHighestRank {
	old: boolean;
	tier: number;
	patched_tier: string;
	season: string;
}

export interface ValorantAccount {
	puuid: string;
	region: ValorantRegions;
	account_level: number;
	name: string;
	tag: string;
	card: ValorantAccountCard;
	last_update: string;
	last_update_raw: number;
}

export interface ValorantAccountCard {
	small: string;
	large: string;
	wide: string;
	id: string;
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

export interface List {
	list: Term[];
}

export interface Term {
	definition: string;
	permalink: string;
	thumbs_up: number;
	author: string;
	word: string;
	defid: number;
	current_vote: string;
	written_on: string;
	example: string;
	thumbs_down: number;
}
