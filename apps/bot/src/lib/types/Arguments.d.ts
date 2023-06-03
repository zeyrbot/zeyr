import type { DatabaseUtility } from "../../utilities/database";
import type { ImageUtility } from "../../utilities/image";
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

export default undefined;
