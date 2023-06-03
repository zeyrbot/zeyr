import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Client as MDN } from "@zeyrbot/mdn";

@RegisterSubCommandGroup("util", "docs", (builder) =>
	builder
		.setName("mdn")
		.setDescription("Browse MDN documentation")
		.addStringOption((builder) =>
			builder
				.setName("query")
				.setDescription("Query to search for")
				.setRequired(true)
		)
		.addUserOption((builder) =>
			builder.setName("target").setDescription("Target to @ping on response")
		)
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const query = interaction.options.getString("query", true);
		const target = interaction.options.getUser("target");

		const search = await this.mdn.search(query);

		if (target) {
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/util:docsMDNTargetOk", {
					results: search.documents?.length,
					target: target.toString()
				})
			);
		} else {
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/util:docsMDNOk", {
					results: search.documents?.length
				})
			);
		}
	}

	private mdn = new MDN();
}
