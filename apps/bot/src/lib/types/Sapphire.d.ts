import type { PrismaClient } from "@prisma/client";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		image: ImageManipulation;
	}
}

import type { ImageManipulation } from "../util";
import "tagscript";
declare module "tagscript" {
	interface IActions {
		nsfw?: {
			nsfw: boolean;
			message: string;
		};
	}
}

export default undefined;
