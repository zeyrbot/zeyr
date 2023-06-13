import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("fisheye")
		.setDescription("Renders the provided image with a fish eye effect")
		.addIntegerOption((o) =>
			o
				.setName("radius")
				.setDescription("Radius of the effect")
				.setMinValue(1)
				.setMaxValue(10)
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

		const radius = interaction.options.getInteger("radius") ?? 2;
		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply("Please provide a valid image or url");

		const canvas = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		canvas.resize(250, 250);
		canvas.cropCircle();
		canvas.fisheye(radius);

		const { buffer } = await canvas.encode();
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
