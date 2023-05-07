import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Interpreter, StringTransformer } from "tagscript";
import { tagParsers } from "../../lib/util";
import {
	GuildTransformer,
	MemberTransformer,
	UserTransformer,
} from "tagscript-plugin-discord";
import { AttachmentBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { getTag, incrementTagUsage } from "../../lib/database/tags";

@ApplyOptions<Command.Options>({
  registerSubCommand: {
    parentCommandName: "tag",
    slashSubcommand: (builder) =>
      builder
        .setName("show")
        .setDescription("Display a tag")
        .addStringOption((s) =>
          s.setName("name").setDescription("Name of the tag").setRequired(true)
        )
        .addStringOption((s) =>
          s.setName("args").setDescription("Optional args for tag").setRequired(false)
        ),
  },
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const name = interaction.options.getString("name", true);
		const args = interaction.options.getString("args");

		const embeds: EmbedBuilder[] = [];
		const files: AttachmentBuilder[] = [];

		const tag = await getTag(name, interaction.guildId!);

		if (!tag) {
			return interaction.editReply(
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

		if (content.actions.files) {
			for (const file of content.actions.files) {
				files.push(new AttachmentBuilder(file));
			}
		}

		if (content.actions.embed) {
			embeds.push(new EmbedBuilder(content.actions.embed));
		}

		if (content.actions.deleteMessage) {
			interaction.editReply("sike");
			await interaction.deleteReply();

			return interaction.channel?.send({
				content: content.body!,
				embeds,
				files,
			});
		}

		await incrementTagUsage(tag.id);

		return interaction.editReply({
			content: content.body!,
			embeds,
			files,
		});
	}
}
