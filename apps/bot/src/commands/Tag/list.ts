import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { resolveKey } from "@sapphire/plugin-i18next";
import { getTagsList } from "../../lib/database/tags";
import { accentColor } from "../../lib/util";
import { EmbedBuilder } from "discord.js";
import type { Tag } from "@prisma/client";
import { chunk } from "@sapphire/utilities";

// TODO: List per server or user (currently per server)

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'tag',
        slashSubcommand: (builder) => builder.setName('list').setDescription('Display tags on this server')
    }
})
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

		return await this.tagList(tags).run(interaction);
	}

	private tagList(tags: Tag[]) {
		const pagination = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(accentColor)
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
