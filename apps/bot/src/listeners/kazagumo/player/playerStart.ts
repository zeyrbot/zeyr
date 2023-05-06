import { ApplyOptions } from "@sapphire/decorators";
import { Listener, container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { TextChannel } from "discord.js";
import type { KazagumoPlayer, KazagumoTrack } from "kazagumo";

@ApplyOptions<Listener.Options>({
	emitter: container.kazagumo
})
export class UserEvent extends Listener {
	public override async run(player: KazagumoPlayer, track: KazagumoTrack) {
		const channel = this.container.client.channels.cache.get(
			player.textId,
		) as TextChannel;
		const guild = this.container.client.guilds.cache.get(player.guildId);

		channel.send(
			await resolveKey(guild!, "commands/music:playNowPlaying", {
				title: track.title,
			}),
		);
	}
}
