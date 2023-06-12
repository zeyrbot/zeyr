import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

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
			return interaction.editReply("Please provide a valid image or url");

		const jpeg = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		const { buffer } = await jpeg.encodeJPEG(quality);
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
