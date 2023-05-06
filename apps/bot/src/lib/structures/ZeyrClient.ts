import { SapphireClient, container } from "@sapphire/framework";
import { greenBright, redBright } from "colorette";
import type { ClientOptions } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Connectors } from "shoukaku";
import { nodes } from "../util";
import { Kazagumo, Plugins } from "kazagumo";

export class ZeyrClient extends SapphireClient {
	constructor(opts: ClientOptions) {
		super(opts);

		container.prisma = new PrismaClient();
		container.kazagumo = new Kazagumo(
			{
				defaultSearchEngine: "youtube",
				plugins: [new Plugins.PlayerMoved(this)],
				send: (guildId, payload) => {
					const guild = this.guilds.cache.get(guildId);
					if (guild) guild.shard.send(payload);
				},
			},
			new Connectors.DiscordJS(this),
			nodes,
		);
	}

	public async start() {
		await super.login(process.env.DISCORD_TOKEN);
		container.logger.info(`${greenBright("")} Connected`);
		await container.prisma
			.$connect()
			.then(() => container.logger.info(`${greenBright("")} Prisma online`))
			.catch(() =>
				container.logger.fatal(`${redBright("")} Prisma connection failed`),
			);
	}

	public panic(error: unknown) {
		container.logger.fatal(error);
		super.destroy();
		process.exit(1);
	}
}
