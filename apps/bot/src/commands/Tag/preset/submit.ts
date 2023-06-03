import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";

@RegisterSubCommandGroup("tag", "preset", (builder) =>
	builder
		.setName("submit")
		.setDescription("Submit a tag to the preset store")
		.addStringOption((s) =>
			s
				.setName("name")
				.setDescription("Name of an existing tag")
				.setRequired(true)
		)
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		// const name = interaction.options.getString("name", true);
		// const formattedName = name.replace(/[^a-zA-Z0-9]/g, '_');

		return interaction.reply("wip");
	}
}
