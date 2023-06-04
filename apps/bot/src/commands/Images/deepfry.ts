import { lastMedia, optimalFileName } from "../../lib/util";
import { LanguageKeys } from "../../lib/util/i18n/keys";
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
		.setName("deepfry")
		.setDescription("Deepfries the provided image")
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

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, LanguageKeys.Images.InvalidImage)
			);

		const output = await this.container.utilities.image.decode(
			image.proxyURL ?? image.url
		);

		const originalWidth = output.width;
		const originalHeight = output.height;

		output.resize(100, 100);
		output.red(10);
		output.saturation(100, true);
		output.lightness(0.4);
		output.red(50);
		output.green(10);
		output.resize(originalWidth, originalHeight);

		const { buffer } = await output.encodeJPEG(1);
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("jpg")
		});

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(
					interaction.guild,
					LanguageKeys.General.StopwatchFinished,
					{
						time: stopwatch.stop().toString()
					}
				)
			),
			files: [file]
		});
	}
}
