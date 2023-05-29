export type ValorantRegions =
	| "ap"
	| "br"
	| "eu"
	| "kr"
	| "latam"
	| "na"; /** note: for querying the api, BR and LATAM should be named as NA */

export interface ValorantRoot<T> {
	status: number;
	data: T;
}

export interface ValorantMMR {
	name: string;
	tag: string;
	puuid: string;
	current_data: ValorantCurrentData;
	highest_rank: ValorantMMRHighestRank;
}

export interface ValorantCurrentData {
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
