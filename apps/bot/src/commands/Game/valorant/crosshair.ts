import { Valorant } from "../../../lib/util";
import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";
import { AttachmentBuilder } from "discord.js";

@RegisterSubCommandGroup("game", "valorant", (builder) => 
	builder
		.setName("crosshair")
		.setDescription("Convert crosshair code into a image")
		.addStringOption((s) => 
			s
				.setName("code")
				.setDescription("Crosshair's code")
				.setRequired(true)
		)
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const code = interaction.options.getString("code", true);

		const crosshair = await this.valorant.crosshair(code);

		const image = new AttachmentBuilder(Buffer.from(crosshair), {
			name: "crosshair.png",
		});

		return interaction.reply({
			files: [image],
		});
	}

	private valorant = new Valorant();
}
