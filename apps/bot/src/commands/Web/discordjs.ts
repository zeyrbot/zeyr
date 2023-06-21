import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import { cast, isNullish } from "@sapphire/utilities";
import { EmbedBuilder } from "discord.js";
import { Doc, type SourcesStringUnion } from "discordjs-docs-parser";

const sources = [
	"stable",
	"main",
	"rpc",
	"collection",
	"builders",
	"voice",
	"rest"
];

@RegisterSubCommand("web", (builder) =>
	builder
		.setName("djs")
		.setDescription("Search through Discord.js documentation")
		.addStringOption((s) =>
			s.setName("query").setDescription("Search query").setRequired(true)
		)
		.addStringOption((s) =>
			s
				.setName("source")
				.setDescription("Source of the docs")
				.setChoices(
					...sources.map((source) => ({ name: source, value: source }))
				)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const query = interaction.options.getString("query", true);
		const source = interaction.options.getString("source") ?? "stable";

		const doc = await Doc.fetch(cast<SourcesStringUnion>(source), {
			force: true
		});

		const result = doc.get(...query.split(/\.|\ /g));

		if (isNullish(result)) {
			throw new UserError({
				identifier: "DJSNoResults",
				message: "No results found by that query"
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(result.formattedName)
			.setColor(result.deprecated ? Colors.RED_500 : Colors.SKY_500)
			.setDescription(result.formattedDescription)
			.setURL(result.sourceURL)
			.addFields(
				{
					name: "Examples",
					value: result.examples?.join("\n") ?? "No examples"
				},
				{
					name: "Type",
					value: result.type?.join("\n") ?? "No type"
				}
			);

		if (result.deprecated) {
			embed.setFooter({
				text: "deprecated"
			});
		}

		return interaction.reply({
			embeds: [embed]
		});
	}
}
