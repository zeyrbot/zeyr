import { optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { objectEntries } from "@sapphire/utilities";

const overlays = {
	hearts: "https://imgur.com/v6rBSVZ.png",
	fire: "https://imgur.com/wky5Pme.png"
};

@RegisterSubCommandGroup("image", "fun", (builder) =>
	builder
		.setName("overlay")
		.setDescription("Render an image on top of another image (PNG recommended)")
		.addStringOption((o) =>
			o
				.setName("preset")
				.setDescription("Existing overlay")
				.setRequired(false)
				.addChoices(
					...objectEntries(overlays).map(([name, url]) => ({
						name,
						value: url
					}))
				)
		)
		.addAttachmentOption((o) =>
			o.setName("overlay").setDescription("Custom overlay").setRequired(false)
		)
		.addAttachmentOption((o) =>
			o.setName("image").setDescription("Image to overlay").setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const overlayURL =
			interaction.options.getString("preset") ??
			interaction.options.getAttachment("overlay")?.proxyURL;

		const image = await this.container.utilities.image.getMedia(
			interaction,
			"image"
		);

		if (!image || !overlayURL)
			return interaction.editReply("Please provide a valid image or overlay");

		const overlay = await this.container.utilities.image.get(overlayURL);
		const canvas = await this.container.utilities.image.get(
			image.proxyURL ?? image.url
		);

		canvas.composite(overlay.resize(canvas.width, canvas.height), 0, 0);

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
