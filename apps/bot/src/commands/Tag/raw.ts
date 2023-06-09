import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { codeBlock } from "@sapphire/utilities";
import { EmbedBuilder } from "discord.js";
import { getTag } from "../../lib/database/tags";
import { accentColor } from "../../lib/util";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: "tag",
        slashSubcommand: (builder) =>
          builder
            .setName("raw")
            .setDescription("Display a tag without any parsing")
            .addStringOption((s) =>
              s.setName("name").setDescription("Name of the tag").setRequired(true)
            )
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

		const tag = await getTag(name, interaction.guildId);

		if (!tag) {
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/tag:tagNotFound"),
			);
		}

		const author = await this.container.client.users.fetch(tag.author.id);

		const embed = new EmbedBuilder()
			.setColor(accentColor)
			.setTitle(tag.name)
			.setAuthor({
				iconURL:
					interaction.user.displayAvatarURL() ??
					interaction.user.defaultAvatarURL,
				name: interaction.user.username,
			})
			.setDescription(codeBlock(tag.content))
			.addFields([
				{
					name: await resolveKey(interaction.guild!, "commands/tag:tagRawUses"),
					value: codeBlock(tag.uses.toString()),
					inline: true,
				},
				{
					name: await resolveKey(
						interaction.guild,
						"commands/tag:tagRawAuthor",
					),
					value: codeBlock(author.tag),
					inline: true,
				},
				{
					name: await resolveKey(interaction.guild, "commands/tag:tagRawDate"),
					value: `<t:${Math.floor(tag.createdAt.getTime() / 1000)}:R>`,
				},
			]);

		return interaction.editReply({
			embeds: [embed],
		});
	}
}
