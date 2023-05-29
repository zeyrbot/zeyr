import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";

@RegisterSubCommandGroup("util", "docs", (builder) =>
	builder
		.setName("mdn")
		.setDescription("Browse MDN documentation")
		.addStringOption((builder) =>
			builder
				.setName("query")
				.setDescription("Query to search for")
				.setRequired(true),
		)
		.addUserOption((builder) =>
			builder.setName("target").setDescription("Target to @ping on response"),
		),
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		return interaction.reply(
			"work in progress\n\nhey im runa (zeyr founder lol) im too sleepy rn so i maybe finish this later lol",
		);
	}
}
