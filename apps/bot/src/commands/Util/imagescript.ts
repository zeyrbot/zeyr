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

@RegisterSubCommand("util", (builder) =>
	builder
	  .setName("imagescript")
	  .setDescription("Runs imagescript code in a separate container")
  )
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const modal = new ModalBuilder()
			.setCustomId("@util/imagescript")
			.setTitle("Run Imagescript code")
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("code")
						.setLabel("Code")
						.setPlaceholder("Imagescript code to run")
						.setRequired(true)
						.setStyle(TextInputStyle.Paragraph),
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId("inject")
						.setLabel("Inject")
						.setPlaceholder(
							"Extra variables to pass in the execution, use JSON format.",
						)
						.setRequired(false)
						.setStyle(TextInputStyle.Paragraph),
				),
			);

		return await interaction.showModal(modal);
	}
}
