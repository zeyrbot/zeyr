import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";

@RegisterSubCommand("tag", (builder) =>
	builder
		.setName("add")
		.setDescription("Adds a new tag to the current guild")
		.addStringOption((o) =>
			o.setName("name").setDescription("Tag's name").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const name = interaction.options.getString("name", true);

		if (/\W/g.test(name))
			new UserError({
				identifier: "TagAddInvalidName",
				message:
					"Tag name may not contain non-word characters (underscores allowed)"
			});

		const modal = new ModalBuilder()
			.setCustomId(`@tag/add/${name}`)
			.setTitle("Tag add form")
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("content")
						.setLabel("Content")
						.setPlaceholder("Tag content")
						.setRequired(true)
						.setStyle(TextInputStyle.Paragraph)
				)
			);

		return await interaction.showModal(modal);
	}
}
