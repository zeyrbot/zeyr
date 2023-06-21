import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";

@RegisterSubCommand("tag", (builder) =>
	builder
		.setName("edit")
		.setDescription("Edit an existing tag")
		.addStringOption((o) =>
			o.setName("name").setDescription("Tag's name").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const name = interaction.options.getString("name", true);

		const modal = new ModalBuilder()
			.setCustomId(`@tag/edit/${name}`)
			.setTitle("Tag edit form")
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("newcontent")
						.setLabel("New content")
						.setPlaceholder("Tag new content")
						.setRequired(true)
						.setStyle(TextInputStyle.Paragraph)
				)
			);

		return await interaction.showModal(modal);
	}
}
