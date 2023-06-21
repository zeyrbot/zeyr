import { optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { Frame, GIF } from "imagescript";

@RegisterSubCommandGroup("image", "gif", (builder) =>
	builder
		.setName("spin")
		.setDescription("Crop and make a spinning GIF of an image")
		.addAttachmentOption((o) =>
			o
				.setName("image")
				.setDescription("Image to manipulate")
				.setRequired(false)
		)
)
export class GroupCommand extends Command {
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

		const frames: Frame[] = [];

		const canvas = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		canvas.resize(this.OPTIMAL_WIDTH, this.OPTIMAL_HEIGHT);
		canvas.cropCircle();

		for (let i = 0; i < this.FRAME_COUNT; i++) {
			const angle = (i / this.FRAME_COUNT) * 360;

			frames.push(
				Frame.from(
					canvas.clone().rotate(angle, false),
					60,
					0,
					0,
					Frame.DISPOSAL_BACKGROUND
				)
			);
		}

		frames.pop();

		const gif = await new GIF(frames).encode(100);
		const file = await this.container.utilities.image.attachment(
			Buffer.from(gif),
			optimalFileName("gif")
		);

		return interaction.editReply({
			content: timedText(stopwatch.stop().toString()),
			files: [file]
		});
	}

	private FRAME_COUNT = 20;
	private OPTIMAL_WIDTH = 180;
	private OPTIMAL_HEIGHT = 180;
}
