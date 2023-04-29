import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { languages } from "../../lib/util";
import { getOrCreateGuild, updateGuild } from "../../lib/database/guilds";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
  registerSubCommand: {
    parentCommandName: "configuration",
    slashSubcommand: (builder) =>
      builder
        .setName("language")
        .setDescription("Manage guild's language")
        .addStringOption((s) =>
          s
            .setName("lang")
            .setDescription("New language")
            .setRequired(true)
            .setChoices(
              ...languages.map((l) => ({
                name: l.name,
                value: l.value,
              }))
            )
        ),
  },
  requiredUserPermissions: ["ManageGuild"],
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction,
	) {
		const language = interaction.options.getString("lang", true);

		const guild = await getOrCreateGuild(interaction.guildId!);

		if (!guild)
			return interaction.reply(
				await resolveKey(interaction.guild!, "generic:databaseGuildNotFound"),
			);

		if (guild.language === language)
			return interaction.reply(
				await resolveKey(
					interaction.guild!,
					"commands/configuration:databaseGuildNotFound",
				),
			);

		await updateGuild(
			{
				id: interaction.guildId!,
			},
			{
				language,
			},
		);

		return interaction.reply(
			await resolveKey(
				interaction.guild!,
				"commands/configuration:languageSuccess",
				{
					language,
				},
			),
		);
	}
}
