import { cdn, optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";

@RegisterSubCommandGroup("image", "fun", (builder) =>
	builder
		.setName("speech-balloon")
		.setDescription("Renders a speech bubble with the given image")
		.addAttachmentOption((o) =>
			o.setName("image").setDescription("🗨").setRequired(false)
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

		const [balloon, target] = await Promise.all([
			this.container.utilities.image.get(this.SPEECH_BALLOON_URL),
			this.container.utilities.image.get(image.proxyURL || image.url)
		]);

		target
			.fit(target.width, target.height + (balloon.height - 100) * 2)
			.composite(balloon.resize(target.width, balloon.height - 100), 0, 0)
			.crop(0, 0, target.width, target.height - balloon.height);

		const { buffer } = await target.encode();
		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("gif")
		);

		return interaction.editReply({
			content: timedText(stopwatch.stop().toString(), "Done,"),
			files: [file]
		});
	}

	private SPEECH_BALLOON_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/z0nqjst12ih61.jpg"
	);
}
