import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { create } from "../../lib/database/guilds";

@ApplyOptions<Listener.Options>({})
export class UserEvent extends Listener<typeof Events.GuildCreate> {
  public override async run(guild: Guild) {
    await create(guild.id);
  }
}
