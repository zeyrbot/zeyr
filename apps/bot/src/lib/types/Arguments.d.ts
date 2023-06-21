import type { DatabaseGuildUtility } from "../../utilities/database/guild";
import type { DatabaseTagUtility } from "../../utilities/database/tag";
import type { ImageUtility } from "../../utilities/image";
import type { ParsersUtility } from "../../utilities/parsers";
import type { PrismaClient } from "@prisma/client";
import type { RedisClient } from "@zeyr/redis";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		redis: RedisClient;
	}
}

declare module "@sapphire/plugin-utilities-store" {
	export interface Utilities {
		image: ImageUtility;
		parsers: ParsersUtility;
		tag: DatabaseTagUtility;
		guild: DatabaseGuildUtility;
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		Developer: never;
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
		REDIS_URL: string;
	}
}

declare module "@sapphire/plugin-scheduled-tasks" {
	interface ScheduledTasks {
		reminder: never;
	}
}

export default undefined;
