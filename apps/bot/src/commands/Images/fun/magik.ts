import { lastMedia, optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

@RegisterSubCommandGroup("image", "fun", (builder) =>
	builder
		.setName("magik")
		.setDescription("Applies a distortion/warp effect to provided image")
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

		const { data, info } = await output.resize(500, 500).raw().toBuffer({
			resolveWithObject: true
		});

		const width = info.width;
		const height = info.height;
		const channels = info.channels;

		const magikData = Buffer.alloc(data.length);

		const warpStrength = 0.2;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const warpedX =
					x + Math.sin((y / height) * 2 * Math.PI) * warpStrength * height;
				const warpedY = y;

				const originalX = Math.floor(warpedX);
				const originalY = Math.floor(warpedY);

				const originalIndex = (originalY * width + originalX) * channels;
				const r = data[originalIndex];
				const g = data[originalIndex + 1];
				const b = data[originalIndex + 2];

				const warpedIndex = (y * width + x) * channels;
				magikData[warpedIndex] = r; // Red channel
				magikData[warpedIndex + 1] = g; // Green channel
				magikData[warpedIndex + 2] = b; // Blue channel
			}
		}

		const magik = await this.container.utilities.image.sharpFromBuffer(
			magikData,
			{
				raw: {
					width,
					height,
					channels
				}
			}
		);

		const buffer = await magik.png().toBuffer();
		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("png")
		);
		return interaction.editReply({
			content: timedText(stopwatch.stop().toString(), "Done,"),
			files: [file]
		});
	}

	public clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}
}
