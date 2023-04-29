import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { removeGuild } from "../../lib/database/guilds";

@ApplyOptions<Listener.Options>({})
export class UserEvent extends Listener<typeof Events.GuildDelete> {
	public override async run(guild: Guild) {
		await removeGuild(guild.id);
	}
}
