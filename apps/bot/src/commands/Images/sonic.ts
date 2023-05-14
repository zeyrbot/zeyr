import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { Image, TextLayout } from "imagescript";
import { optimiseGithubCDN } from "../../lib/util";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { AttachmentBuilder } from "discord.js";

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
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const text = interaction.options.getString("text", true);

		const font = await this.container.image.font(this.IMPACT_URL);

		const sonic = await this.container.image.decode(this.SONIC_URL);
		const sonicText = await Image.renderText(
			font,
			64,
			text,
			0xffffffff,
			this.layout,
		);

		sonicText.crop(0, 0, 580, 584);

		sonic.composite(
			sonicText,
			378 + (580 - sonicText.width) / 2,
			103 + (584 - sonicText.height) / 2,
		);

		const { buffer } = await sonic.encode();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: "sonic.gif",
		});

		return interaction.editReply({
			content: (await resolveKey(
				interaction.guild,
				"general:stopwatchFinished",
				{
					time: stopwatch.stop().toString(),
				},
			)) as string,
			files: [file],
		});
	}

	private SONIC_URL = optimiseGithubCDN(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/sonic.jpg",
	);

	private IMPACT_URL = optimiseGithubCDN(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/fonts/impact.ttf",
	);

	private layout = new TextLayout({
		maxWidth: 580,
		maxHeight: 584,
		verticalAlign: "center",
		horizontalAlign: "middle",
	});
}
