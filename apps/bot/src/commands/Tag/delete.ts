import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { deleteTag } from "../../lib/database/tags";

// TODO: Check if user is admin or tag owner

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'tag',
        slashSubcommand: (builder) => builder.setName('delete').setDescription('Delete a tag')
        .addStringOption((s) => s.setName("name").setDescription("Name of the target tag").setRequired(true))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const name = interaction.options.getString("name", true);

		await deleteTag(name, interaction.guildId).catch(async (err) => {
			console.log(err);
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/tag:tagNotFound"),
			);
		});

		return interaction.reply(
			await resolveKey(interaction.guild, "commands/tag:tagDeleteOk", {
				tag: name,
			}),
		);
	}
}
