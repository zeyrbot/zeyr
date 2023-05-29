import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

@RegisterSubCommand("tag", (builder) =>
	builder.setName("create").setDescription("Create a new tag"),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const modal = new ModalBuilder()
			.setCustomId("@tag/add")
			.setTitle("Create a tag")
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("name")
						.setLabel("Name")
						.setPlaceholder("E.g: welcome")
						.setRequired(true)
						.setStyle(TextInputStyle.Short),
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("content")
						.setLabel("Content")
						.setPlaceholder("Content of the tag")
						.setRequired(true)
						.setStyle(TextInputStyle.Paragraph),
				),
			);

		return await interaction.showModal(modal);
	}
}
