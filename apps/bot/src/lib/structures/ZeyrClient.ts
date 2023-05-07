import { SapphireClient, container } from "@sapphire/framework";
import { greenBright, redBright } from "colorette";
import type { ClientOptions } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { Connectors } from "shoukaku";
import { nodes } from "../util";
import { Kazagumo, Plugins } from "kazagumo";
import SpotifyPlugin from "kazagumo-spotify";
import DeezerPlugin from "stone-deezer";

export class ZeyrClient extends SapphireClient {
	constructor(opts: ClientOptions) {
		super(opts);

		container.prisma = new PrismaClient();
		container.kazagumo = new Kazagumo(
			{
				defaultSearchEngine: "spotify",
				plugins: [
					new Plugins.PlayerMoved(this),
					new DeezerPlugin(),
					new SpotifyPlugin({
						clientId: process.env.SPOTIFY_ID!,
						clientSecret: process.env.SPOTIFY_SECRET!,
						playlistPageLimit: 1, // optional ( 100 tracks per page )
						albumPageLimit: 1, // optional ( 50 tracks per page )
						searchLimit: 15, // optional ( track search limit. Max 50 )
						searchMarket: "US", // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
					}),
				],
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
