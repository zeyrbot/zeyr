import { format } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { codeBlock } from "@sapphire/utilities";

@RegisterSubCommand("dev", (builder) =>
	builder.setName("guilds").setDescription("Restricted usage")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const guildCount = this.container.client.guilds.cache.size;
		const guilds = this.container.client.guilds.cache.map((g) => g.name);

		return interaction.reply({
			content: format(
				"Total guilds: {}\n{}",
				guildCount.toString(),
				codeBlock(guilds.join("\n"))
			)
		});
	}
}
