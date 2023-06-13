import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { image_search } from "@mudbill/duckduckgo-images-api";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { EmbedBuilder, hyperlink } from "discord.js";
import { err } from "../../lib/util";

@RegisterSubCommand("web", (builder) =>
	builder
		.setName("images")
		.setDescription("Search images through internet")
		.addStringOption((s) =>
			s.setName("query").setDescription("Search query").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const query = interaction.options.getString("query", true);

		const display = new PaginatedMessage({
			template: new EmbedBuilder().setColor(Colors.SKY_500)
		});

		const results = await image_search({
			query,
			moderate: true
		});

		if (results.length === 0)
			return interaction.reply(err("No results found by that query"));

		for (const result of results.slice(0, 24)) {
			display.addPageEmbed((embed) =>
				embed
					.setTitle(result.source)
					.setDescription(hyperlink(result.title, result.url))
					.setThumbnail(result.thumbnail)
					.setImage(result.image)
			);
		}

		return await display.run(interaction, interaction.user);
	}
}
