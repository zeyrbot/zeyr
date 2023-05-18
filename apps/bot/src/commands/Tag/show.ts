import { getTag, incrementTagUsage } from "../../lib/database/tags";
import { tagParsers } from "../../lib/util";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { AttachmentBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { Interpreter, StringTransformer } from "tagscript";
import {
	GuildTransformer,
	MemberTransformer,
	UserTransformer,
} from "tagscript-plugin-discord";

@RegisterSubCommand('tag', (builder) =>
	builder
		.setName("show")
		.setDescription("Run and display a tag content")
		.addStringOption((s) =>
			s.setName("name").setDescription("Name of the tag").setRequired(true).setAutocomplete(true)
		)
		.addStringOption((s) =>
			s
				.setName("args")
				.setDescription("Optional args of tag")
				.setRequired(false)
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const name = interaction.options.getString("name", true);
		const args = interaction.options.getString("args");

		const embeds: EmbedBuilder[] = [];
		const files: AttachmentBuilder[] = [];

		const tag = await getTag(name, interaction.guildId!);

		if (!tag) {
			return interaction.reply(
				await resolveKey(interaction.guild!, "commands/tag:tagNotFound"),
			);
		}

		const interpreter = new Interpreter(...tagParsers);
		const content = await interpreter.run(tag.content, {
			user: new UserTransformer(interaction.user),
			member: new MemberTransformer(interaction.member as GuildMember),
			guild: new GuildTransformer(interaction.guild!),
			args: new StringTransformer(args ?? ""),
		});

		if (content.actions.nsfw?.nsfw)
			return interaction.reply(content.actions.nsfw.message);

		files.push(
			...(content.actions.files || []).map(
				(file) => new AttachmentBuilder(file),
			),
		);

		embeds.push(
			...(content.actions.embed
				? [new EmbedBuilder(content.actions.embed)]
				: []),
		);

		if (content.actions.deleteMessage) {
			interaction.reply({
				content: "🎉 Done",
				ephemeral: true,
			});

			return interaction.channel?.send({
				content: content.body!,
				embeds,
				files,
			});
		}

		await incrementTagUsage(tag.id);

		return interaction.reply({
			content: content.body!,
			embeds,
			files,
		});
	}
}
