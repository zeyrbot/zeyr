import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

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
			return interaction.editReply("Please provide a valid image or url");

		const output = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url
		);

		output
			.modulate({
				saturation: 2,
				brightness: 1.1
			})
			.sharpen()
			.gamma(1.5)
			.toColourspace("rgb");

		const buffer = await output
			.jpeg({
				quality: 1
			})
			.toBuffer();

		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("jpg")
		);

		return interaction.editReply({
			content: timedText(stopwatch.stop().toString(), "Done,"),
			files: [file]
		});
	}
}
