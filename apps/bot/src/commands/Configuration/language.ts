import { languages } from "../../lib/util";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
	requiredUserPermissions: ["ManageGuild"],
})
@RegisterSubCommand("configuration", (builder) =>
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
					})),
				),
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const language = interaction.options.getString("lang", true);

		const guild = await this.container.utilities.database.guildGetOrCreate(
			interaction.guildId,
		);

		if (!guild)
			return interaction.reply(
				await resolveKey(interaction.guild, "generic:databaseGuildNotFound"),
			);

		if (guild.language === language)
			return interaction.reply(
				await resolveKey(
					interaction.guild,
					"commands/configuration:languageIsEqual",
				),
			);

		await this.container.utilities.database.guildUpdate(
			{
				id: interaction.guildId,
			},
			{
				language,
			},
		);

		return interaction.reply(
			await resolveKey(
				interaction.guild,
				"commands/configuration:languageSuccess",
				{
					language,
				},
			),
		);
	}
}
