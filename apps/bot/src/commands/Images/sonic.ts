import { cdn, optimalFileName } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";
import { Image, TextLayout } from "imagescript";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("sonic")
		.setDescription("Renders the given text on a sonic quote template")
		.addStringOption((s) =>
			s.setName("text").setDescription("Text of the image").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const text = interaction.options.getString("text", true);

		const font = await this.container.utilities.image.font(this.IMPACT_URL);

		const sonic = await this.container.utilities.image.decode(this.SONIC_URL);
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
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("gif")
		});

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(interaction.guild, "general:stopwatchFinished", {
					time: stopwatch.stop().toString()
				})
			),
			files: [file]
		});
	}

	private SONIC_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/sonic.jpg"
	);

	private IMPACT_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/fonts/impact.ttf"
	);

	private layout = new TextLayout({
		maxWidth: 580,
		maxHeight: 584,
		verticalAlign: "center",
		horizontalAlign: "middle"
	});
}
