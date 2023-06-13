import { lastMedia, optimalFileName, timedText } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("circle")
		.setDescription("Applies a radial blur on the provided image")
		.addNumberOption((o) =>
			o
				.setName("iterations")
				.setDescription("Number of iterations")
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

		const iterations = interaction.options.getNumber("iterations") ?? 10;

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply("Please provide a valid image or url");

		const canvas = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		for (let i = iterations; i >= 0; i--) {
			canvas.composite(canvas.clone().opacity(0.1).rotate(i, false));
		}

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
