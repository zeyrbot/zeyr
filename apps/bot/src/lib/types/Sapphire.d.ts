import type { PrismaClient } from "@prisma/client";
import type { ImageManipulation } from "../util";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		image: ImageManipulation;
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
