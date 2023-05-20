import type { Nullable } from "../generic";

export type CSGOPlatforms = "steam";
export type ApexPlatforms = "origin" | "steam" | "xbl" | "psn";

export interface TrackerRoot<T> {
	data: T;
}

export interface ApexProfile {
	platformInfo: ApexProfilePlatformInfo;
	userInfo: ApexProfileUserInfo;
	metadata: ApexProfileMetadata;
	expiryDate: string;
}

export interface ApexProfilePlatformInfo {
	platformSlug: string;
	platformUserId: string;
	platformUserHandle: string;
	platformUserIdentifier: string;
	avatarUrl: string;
}

export interface ApexProfileUserInfo {
	userId: Nullable<string | number>;
	isPremium: boolean;
	isVerified: boolean;
	isInfluencer: boolean;
	pageviews: number;
}

export interface ApexProfileMetadata {
	currentSeason: number;
	activeLegend: string;
	activeLegendName: string;
	isGameBanned: boolean;
	isOverwolfAppUser: boolean;
}
