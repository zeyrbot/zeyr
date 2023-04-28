import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { remove } from "../../lib/database/guilds";

@ApplyOptions<Listener.Options>({})
export class UserEvent extends Listener<typeof Events.GuildDelete> {
  public override async run(guild: Guild) {
    await remove(guild.id);
  }
}
