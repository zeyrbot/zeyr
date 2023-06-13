import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("flip")
		.setDescription("Mirrors the provided image vertically (or horizontally)")
		.addStringOption((o) =>
			o
				.setName("direction")
				.setDescription("Vertical or horizontal")
				.setRequired(false)
				.setChoices(
					{
						name: "Vertical",
						value: "vertical"
					},
					{
						name: "Horizontal",
						value: "horizontal"
					}
				)
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

		const direction =
			cast<"vertical" | "horizontal">(
				interaction.options.getString("direction")
			) ?? "vertical";
		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply("Please provide a valid image or url");

		const canvas = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url
		);

		if (direction === "vertical") {
			canvas.flip();
		} else {
			canvas.flop();
		}

		const buffer = await canvas.png().toBuffer();
		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("png")
		);
		return interaction.editReply({
			content: timedText(stopwatch.stop().toString(), "Done,"),
			files: [file]
		});
	}
}
