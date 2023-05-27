import { getTagsList } from "../../lib/database/tags";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import type { Tag } from "@prisma/client";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { type TFunction, fetchT, resolveKey } from "@sapphire/plugin-i18next";
import { chunk } from "@sapphire/utilities";
import { EmbedBuilder, Guild, User, inlineCode } from "discord.js";

// TODO: List per server or user (currently per server)

@RegisterSubCommand('tag', (builder) =>
	builder
		.setName("list")
		.setDescription("Show guild tags")
		.addUserOption((u) => u.setName("user").setDescription("User to see tags from").setRequired(false))
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const user = interaction.options.getUser("user", false);
		const tags = await getTagsList(interaction.guildId, user?.id);

		if (tags.length <= 0) {
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/tag:tagListNoTags"),
			);
		}

		return await this.pagination(
			await fetchT(interaction.guild),
			user ?? interaction.guild,
			tags,
		).run(interaction);
	}

	private pagination(t: TFunction, target: User | Guild, tags: Tag[]) {
		const pagination = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(Colors.SKY_500)
				.setTitle(
					t("commands/tag:tagListTitle", {
						target: target instanceof Guild ? target.name : target.username,
					}),
				)
				.setFooter({
					text: t("commands/tag:tagListFooter", {
						total: tags.length,
					}),
				}),
		});

		const pages = chunk(tags, 10);

		for (const pageTags of pages) {
			pagination.addPageEmbed((embed) =>
				embed //
					.setDescription(
						pageTags
							.map((tag, index) => `${inlineCode(String(++index))} ${tag.name}`)
							.join("\n"),
					),
			);
		}

		return pagination;
	}
}
