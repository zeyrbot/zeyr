import { PrismaClient } from "@prisma/client";
import { SapphireClient, container } from "@sapphire/framework";
import { greenBright, redBright } from "colorette";
import type { ClientOptions } from "discord.js";

export class ZeyrClient extends SapphireClient {
	constructor(opts: ClientOptions) {
		super(opts);

		container.prisma = new PrismaClient();
	}

	public async start() {
		await super.login(process.env.DISCORD_TOKEN);
		container.logger.info(`${greenBright("")} Connected`);
		await container.prisma
			.$connect()
			.then(() => container.logger.info(`${greenBright("")} Prisma online`))
			.catch(() =>
				container.logger.fatal(`${redBright("")} Prisma connection failed`)
			);
	}

	public panic(error: unknown) {
		container.logger.fatal(error);
		super.destroy();
		process.exit(1);
	}
}
