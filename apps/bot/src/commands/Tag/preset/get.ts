import { LanguageKeys } from "../../../lib/util/i18n/keys";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Result } from "@sapphire/result";
import { inlineCodeBlock } from "@sapphire/utilities";

@RegisterSubCommandGroup("tag", "preset", (builder) =>
	builder
		.setName("get")
		.setDescription("Add a tag from the preset store")
		.addStringOption((s) =>
			s.setName("name").setDescription("Tag name").setRequired(true)
		)
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const name = interaction.options.getString("name", true);

		const result = await Result.fromAsync(
			async () =>
				await fetch<Tag>(
					`https://raw.githubusercontent.com/zeyrbot/tags/main/tags/${name}.json`,
					FetchResultTypes.JSON
				)
		);

		if (result.isErr()) {
			return interaction.reply(
				await resolveKey(interaction.guild, LanguageKeys.Tag.PresetNotFound)
			);
		}

		const tag = result.unwrap();

		const create = await Result.fromAsync(
			async () =>
				await this.container.utilities.database.tagCreate(
					tag.name,
					tag.content,
					interaction.guildId,
					tag.author === "" ? interaction.user.id : tag.author
				)
		);

		create.unwrapOrElse(async () => {
			return interaction.editReply(
				await resolveKey(interaction.guild, LanguageKeys.Tag.AlreadyExists)
			);
		});

		return interaction.reply(
			await resolveKey(interaction.guild, LanguageKeys.Tag.PresetOk, {
				preset: inlineCodeBlock(tag.name)
			})
		);
	}
}

export interface Tag {
	id: string;
	name: string;
	description: string;
	content: string;
	author: string;
}
