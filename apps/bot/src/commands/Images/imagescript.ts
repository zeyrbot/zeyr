import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { AttachmentBuilder } from "discord.js";

@RegisterSubCommand("image", (builder) =>
	builder
	  .setName("imagescript")
	  .setDescription("Runs imagescript code in a separate container")
	  .addStringOption((s) =>
		s.setName("code").setDescription("Code to run (JS)").setRequired(true)
	  )
  )
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const code = interaction.options.getString("code", true);

		const data = await this.container.image.imagescript(code);

		const buffer = data.image;
		const file = new AttachmentBuilder(buffer!, {
			name: `imagescript.${data.format ?? "png"}`,
		});

		return interaction.editReply({
			content: (await resolveKey(
				interaction.guild,
				"general:stopwatchFinished",
				{
					time: stopwatch.stop().toString(),
				},
			)) as string,
			files: [file],
		});
	}
}
