import { tagParsers } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder, EmbedBuilder, GuildMember } from "discord.js";
import sharp from "sharp";
import { Interpreter, StringTransformer } from "tagscript";
import {
	GuildTransformer,
	MemberTransformer,
	UserTransformer
} from "tagscript-plugin-discord";

@RegisterSubCommand("tag", (builder) =>
	builder
		.setName("show")
		.setDescription("Run and display a tag content")
		.addStringOption((s) =>
			s
				.setName("name")
				.setDescription("Name of the tag")
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption((s) =>
			s
				.setName("args")
				.setDescription("Optional args of tag")
				.setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const name = interaction.options.getString("name", true);
		const args = interaction.options.getString("args");

		const embeds: EmbedBuilder[] = [];
		const files: AttachmentBuilder[] = [];

		const tag = await this.container.utilities.database.tagGet(
			name,
			interaction.guildId!
		);

		if (!tag) {
			return interaction.reply(
				await resolveKey(interaction.guild!, "commands/tag:tagNotFound")
			);
		}

		const interpreter = new Interpreter(...tagParsers);
		const content = await interpreter.run(tag.content, {
			user: new UserTransformer(interaction.user),
			member: new MemberTransformer(interaction.member as GuildMember),
			guild: new GuildTransformer(interaction.guild!),
			args: new StringTransformer(args ?? "")
		});

		if (content.actions.nsfw?.nsfw)
			return interaction.reply(content.actions.nsfw.message);

		if (content.actions.files) {
			for (const file of cast<string[] | Buffer[]>(content.actions.files)) {
				const url =
					file instanceof Buffer
						? file
						: await sharp(
								await this.container.utilities.image.fetch(cast<string>(file))
						  ).toBuffer();

				files.push(new AttachmentBuilder(url));
			}
		}

		embeds.push(
			...(content.actions.embed
				? [new EmbedBuilder(content.actions.embed)]
				: [])
		);

		await this.container.utilities.database.tagUsageIncrement(tag.id);

		return interaction.reply({
			content: content.body!,
			embeds,
			files
		});
	}
}
