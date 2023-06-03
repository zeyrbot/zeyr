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
		.setName("jpeg")
		.setDescription("Renders the provided image as JPEG with given quality")
		.addNumberOption((s) =>
			s
				.setName("quality")
				.setDescription("Quality of the image")
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(false)
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

		const quality = interaction.options.getNumber("quality") ?? 50;
		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/images:invalidImage")
			);

		const jpeg = await this.container.utilities.image.decode(
			image.proxyURL ?? image.url
		);

		const { buffer } = await jpeg.encodeJPEG(quality);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("jpg")
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
