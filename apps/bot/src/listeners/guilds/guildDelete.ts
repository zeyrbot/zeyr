import { removeGuild } from "../../lib/database/guilds";
import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({})
export class UserEvent extends Listener<typeof Events.GuildDelete> {
	public override async run(guild: Guild) {
		await removeGuild(guild.id);
	}
}
