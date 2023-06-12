import { cdn, optimalFileName, timedText } from "../../../lib/util";
import {
	Command,
	RegisterSubCommandGroup
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { Image, TextLayout } from "imagescript";

@RegisterSubCommandGroup("image", "fun", (builder) =>
	builder
		.setName("sonic")
		.setDescription("Renders the given text on a sonic quote template")
		.addStringOption((s) =>
			s
				.setName("text")
				.setDescription("What Sonic should say?")
				.setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const text = interaction.options.getString("text", true);

		const font = await this.container.utilities.image.font(this.FONT_URL);

		const sonic = await this.container.utilities.image.get(this.SONIC_URL);
		const sonicText = await Image.renderText(
			font,
			64,
			text,
			0xffffffff,
			this.layout
		);

		sonicText.crop(0, 0, 580, 584);

		sonic.composite(
			sonicText,
			378 + (580 - sonicText.width) / 2,
			103 + (584 - sonicText.height) / 2
		);

		const { buffer } = await sonic.encode();
		const file = await this.container.utilities.image.attachment(
			Buffer.from(buffer),
			optimalFileName("gif")
		);
		return interaction.editReply({
			content: timedText(stopwatch.stop().toString(), "Done,"),
			files: [file]
		});
	}

	private SONIC_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/sonic.jpg"
	);

	private FONT_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/fonts/impact.ttf"
	);

	private layout = new TextLayout({
		maxWidth: 580,
		maxHeight: 584,
		verticalAlign: "center",
		horizontalAlign: "middle"
	});
}
