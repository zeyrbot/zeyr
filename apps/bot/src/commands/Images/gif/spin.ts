import { lastMedia, optimalFileName } from "../../../lib/util";
import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";
import { Frame, GIF } from "imagescript";

@RegisterSubCommandGroup("image", "gif", (builder) =>
	builder
		.setName("spin")
		.setDescription("Crop and make a spinning GIF of an image")
		.addAttachmentOption((o) =>
			o
				.setName("image")
				.setDescription("Image to manipulate")
				.setRequired(false),
		),
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/images:invalidImage"),
			);

		const frames: Frame[] = [];

		const output = await this.container.utilities.image.decode(
			image.proxyURL ?? image.url,
		);

		output.resize(this.OPTIMAL_WIDTH, this.OPTIMAL_HEIGHT);
		output.cropCircle();

		for (let i = 0; i < this.FRAME_COUNT; i++) {
			const angle = (i / this.FRAME_COUNT) * 360;

			frames.push(
				Frame.from(
					output.clone().rotate(angle, false),
					110,
					0,
					0,
					Frame.DISPOSAL_BACKGROUND,
				),
			);
		}

		frames.pop();

		const gif = await new GIF(frames).encode(100);
		const file = new AttachmentBuilder(Buffer.from(gif), {
			name: optimalFileName("gif"),
		});

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(interaction.guild, "general:stopwatchFinished", {
					time: stopwatch.stop().toString(),
				}),
			),
			files: [file],
		});
	}

	private FRAME_COUNT = 20;
	private OPTIMAL_WIDTH = 180;
	private OPTIMAL_HEIGHT = 180;
}
