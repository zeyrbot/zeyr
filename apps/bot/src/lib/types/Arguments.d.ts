import type { DatabaseUtility } from "../../utilities/database";
import type { ImageUtility } from "../../utilities/image";
import type { TagsUtility } from "../../utilities/tags";
import type { PrismaClient } from "@prisma/client";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
	}
}

declare module "@sapphire/plugin-utilities-store" {
	export interface Utilities {
		image: ImageUtility;
		database: DatabaseUtility;
		tags: TagsUtility;
	}
}

declare module "tagscript" {
	interface IActions {
		nsfw?: {
			nsfw: boolean;
			message: string;
		};
	}
}

declare module "@skyra/env-utilities" {
	interface Env {
		DISCORD_TOKEN: string;
		DLIST_KEY: string;
	}
}

export default undefined;
