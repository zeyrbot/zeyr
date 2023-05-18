import { getTagsList } from "../../lib/database/tags";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import type { Tag } from "@prisma/client";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { resolveKey } from "@sapphire/plugin-i18next";
import { chunk } from "@sapphire/utilities";
import { EmbedBuilder } from "discord.js";

// TODO: List per server or user (currently per server)

@RegisterSubCommand('tag', (builder) =>
	builder
		.setName("list")
		.setDescription("Show guild tags")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const tags = await getTagsList(interaction.guildId);

		if (tags.length <= 0) {
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/tag:tagListNoTags"),
			);
		}

		return await this.pagination(tags).run(interaction);
	}

	private pagination(tags: Tag[]) {
		const pagination = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(Colors.SKY_500)
				.setTitle("Tags list")
				.setFooter({ text: ` Total tags: ${tags.length}` }),
		});

		const pages = chunk(tags, 10);

		for (const pageTags of pages) {
			pagination.addPageEmbed((embed) =>
				embed //
					.setDescription(
						pageTags.map((tag) => `**~** ${tag.name}`).join("\n"),
					),
			);
		}

		return pagination;
	}
}
