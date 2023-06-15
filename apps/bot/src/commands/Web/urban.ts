import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Result } from "@sapphire/result";
import { EmbedBuilder } from "discord.js";
import { UserError } from "@sapphire/framework";
import { Client as Urban } from "@zeyrbot/urbandictionary";
import { Colors } from "@discord-factory/colorize";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

@RegisterSubCommand("web", (builder) =>
	builder
		.setName("urban")
		.setDescription("Search through Urbandictionary")
		.addStringOption((s) =>
			s
				.setName("term")
				.setDescription("Search term")
				.setRequired(true)
				.setAutocomplete(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const term = interaction.options.getString("term", true);

		const urban = new Urban();

		const result = await Result.fromAsync(async () => await urban.define(term));

		const ud = result.unwrapOrElse(() => {
			throw new UserError({
				message: "I didn't find any results for that term",
				identifier: "UrbanNoResults"
			});
		});

		const display = new PaginatedMessage({
			template: new EmbedBuilder().setColor(Colors.SKY_500)
		});

		for (const result of ud.list.slice(0, 24)) {
			display.addPageEmbed((embed) =>
				embed
					.setTitle(result.word)
					.setURL(result.permalink)
					.setDescription(result.definition)
					.addFields({
						name: "Example",
						value: result.example
					})
					.setAuthor({
						name: result.author
					})
					.setFooter({
						text: ` ${result.thumbs_up} 👍 | ${result.thumbs_down} 👎`
					})
			);
		}

		return await display.run(interaction, interaction.user);
	}
}
