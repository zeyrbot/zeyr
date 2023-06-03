import { lastMedia, optimalFileName } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("scale")
		.setDescription("Scales the image")
		.addNumberOption((s) =>
			s
				.setName("size")
				.setDescription("Size of the image")
				.setMinValue(1)
				.setMaxValue(4)
				.setRequired(true)
		)
		.addAttachmentOption((o) =>
			o
				.setName("image")
				.setDescription("Image to manipulate")
				.setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const size = interaction.options.getNumber("size", true);

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/images:invalidImage")
			);

		const output = await this.container.utilities.image.decode(
			image.proxyURL ?? image.url
		);

		output.scale(size);

		const { buffer } = await output.encode();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("png")
		});

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(interaction.guild, "general:stopwatchFinished", {
					time: stopwatch.stop().toString()
				})
			),
			files: [file]
		});
	}
}
