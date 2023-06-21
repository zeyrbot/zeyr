import { cdn, optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { range } from "@sapphire/utilities";
import { Frame, GIF, Image } from "imagescript";

@RegisterSubCommandGroup("image", "gif", (builder) =>
	builder
		.setName("petpet")
		.setDescription("Render a petpet gif")
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
		const assets: Image[] = await Promise.all(
			range(0, 9, 1).map((_, i) =>
				this.container.utilities.image.get(
					cdn(
						`https://raw.githubusercontent.com/zeyrbot/assets/main/images/pet/pet${i}.gif`
					)
				)
			)
		);

		const canvas = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		const parent = new Image(assets[0].width, assets[0].height);

		canvas.resize(parent.width - 20, parent.height - 20);

		for (let i = 0; i < this.FRAME_COUNT; i++) {
			const frame = Frame.from(
				parent.composite(
					canvas,
					parent.width - canvas.width,
					parent.height - canvas.height
				),
				62.5,
				0,
				0,
				Frame.DISPOSAL_BACKGROUND
			);

			frame.composite(assets[i]);

			frames.push(frame);
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

	private FRAME_COUNT = 10;
	// private OPTIMAL_WIDTH = 180;
	// private OPTIMAL_HEIGHT = 180;
}
