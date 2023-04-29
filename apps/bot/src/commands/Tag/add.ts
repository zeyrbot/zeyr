import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { addTag, getTag } from "../../lib/database/tags";
import { UserError } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
  registerSubCommand: {
    parentCommandName: "tag",
    slashSubcommand: (builder) =>
      builder
        .setName("add")
        .setDescription("Subcommand description")
        .addStringOption((s) =>
          s.setName("name").setDescription("Name for the tag").setRequired(true)
        )
        .addStringOption((s) =>
          s
            .setName("content")
            .setDescription("Content for the tag")
            .setRequired(true)
        ),
  },
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const name = interaction.options.getString("name", true);
		const content = interaction.options.getString("content", true);

		getTag(name, interaction.guildId!).catch(() => {
			throw new UserError({
				identifier: "TagNotFound",
				message: "commands/tag:tagAlreadyExists",
				context: {
					isLocalized: true,
				},
			});
		});

		await addTag(name, content, interaction.guildId!, interaction.user.id);

		return interaction.editReply(
			await resolveKey(interaction.guild!, "commands/tag:tagAddedSuccessfully"),
		);
	}
}
