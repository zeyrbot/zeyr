import type { PrismaClient } from "@prisma/client";
import type { Kazagumo } from "kazagumo";
import type { Shoukaku } from "shoukaku";

declare module "@sapphire/framework" {
	interface Preconditions {
		VoiceOnly: never;
	}
}

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		image: ImageManipulation;
	}
}

import "tagscript";
import type { ImageManipulation } from "../util";
declare module "tagscript" {
	interface IActions {
		nsfw?: {
			nsfw: boolean;
			message: string;
		};
	}
}

export default undefined;
