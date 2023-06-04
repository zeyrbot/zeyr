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
		.setName("resize")
		.setDescription("Resizes the provided image")
		.addNumberOption((s) =>
			s
				.setName("width")
				.setDescription("Width of the image")
				.setMinValue(1)
				.setMaxValue(2000)
				.setRequired(true)
		)
		.addNumberOption((s) =>
			s
				.setName("height")
				.setDescription("Height of the image")
				.setMinValue(1)
				.setMaxValue(2000)
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

		const w = interaction.options.getNumber("width", true);
		const h = interaction.options.getNumber("height", true);

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

		output.resize(w, h);

		const { buffer } = await output.encode();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("png")
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
