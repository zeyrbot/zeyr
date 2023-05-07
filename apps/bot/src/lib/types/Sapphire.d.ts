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
		kazagumo: Kazagumo;
	}
}

declare module "@kbotdev/plugin-modules" {
	interface Modules {
		SystemModule: never;
	}
}

export default undefined;
