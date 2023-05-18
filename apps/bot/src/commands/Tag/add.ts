import { addTag } from "../../lib/database/tags";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Result } from "@sapphire/result";

@RegisterSubCommand('tag', (builder) =>
	builder
		.setName("add")
		.setDescription("Add a tag for this guild")
		.addStringOption((s) =>
			s.setName("name").setDescription("Name for the tag").setRequired(true)
		)
		.addStringOption((s) =>
			s
				.setName("content")
				.setDescription("Content for the tag")
				.setRequired(true)
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const name = interaction.options.getString("name", true);
		const content = interaction.options.getString("content", true);

		const tag = await Result.fromAsync(
			async () =>
				await addTag(name, content, interaction.guildId, interaction.user.id),
		);

		tag.unwrapOrElse(async (error) => {
			console.log(error);
			return interaction.editReply(
				await resolveKey(interaction.guild!, "commands/tag:tagAlreadyExists"),
			);
		});

		return interaction.editReply(
			await resolveKey(interaction.guild!, "commands/tag:tagAddOk"),
		);
	}
}
