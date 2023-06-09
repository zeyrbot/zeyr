import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { addTag } from "../../lib/database/tags";

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
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const name = interaction.options.getString("name", true);
		const content = interaction.options.getString("content", true);

		await addTag(name, content, interaction.guildId, interaction.user.id).catch(
			async (err) => {
				console.log(err);
				return interaction.editReply(
					await resolveKey(interaction.guild!, "commands/tag:tagAlreadyExists"),
				);
			},
		);

		return interaction.editReply(
			await resolveKey(interaction.guild!, "commands/tag:tagAddOk"),
		);
	}
}
