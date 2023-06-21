import { optimalFileName, timedText } from "../../lib/util";
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

		const image = await this.container.utilities.image.getMedia(
			interaction,
			"image"
		);

		if (!image)
			return interaction.editReply("Please provide a valid image or url");

		const canvas = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url
		);

		canvas.modulate({ saturation: 2 }).gamma(2).sharpen();

		const buffer = await canvas
			.jpeg({
				quality: 40
			})
			.toBuffer();

		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("jpg")
		);

		return interaction.editReply({
			content: timedText(stopwatch.stop().toString()),
			files: [file]
		});
	}
}
