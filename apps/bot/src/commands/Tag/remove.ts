import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { deleteTag } from "../../lib/database/tags";
import { Result } from "@sapphire/result";

// TODO: Check if user is admin or tag owner

@RegisterSubCommand('tag', (builder) =>
	builder
		.setName("remove")
		.setDescription("Remove a tag from this guild")
		.addStringOption((s) =>
			s.setName("name").setDescription("Name of the tag").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const name = interaction.options.getString("name", true);

		const tag = await Result.fromAsync(
			async () => await deleteTag(name, interaction.guildId),
		);

		tag.unwrapOrElse(async (error) => {
			console.log(error);
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
