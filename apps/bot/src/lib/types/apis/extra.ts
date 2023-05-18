import type { Nullable } from "../generic";

export interface ImagescriptOutput {
	image?: Buffer;
	format?: ImagescriptFormat;
}

export enum ImagescriptFormat {
	PNG = "png",
	GIF = "gif",
}

export interface DlistBot {
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
