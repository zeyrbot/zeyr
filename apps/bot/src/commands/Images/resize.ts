import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

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
			return interaction.editReply("Please provide a valid image or url");

		const output = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		output.resize(w, h);

		const { buffer } = await output.encode();
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