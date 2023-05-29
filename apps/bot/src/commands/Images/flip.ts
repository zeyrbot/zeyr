import { lastMedia, optimalFileName } from "../../lib/util";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";

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
						value: "vertical",
					},
					{
						name: "Horizontal",
						value: "horizontal",
					},
				),
		)
		.addAttachmentOption((o) =>
			o
				.setName("image")
				.setDescription("Image to manipulate")
				.setRequired(false),
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const direction =
			cast<"vertical" | "horizontal">(
				interaction.options.getString("direction"),
			) ?? "vertical";
		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/images:invalidImage"),
			);

		const output = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url,
		);

		if (direction === "vertical") {
			output.flip();
		} else {
			output.flop();
		}

		const buffer = await output.png().toBuffer();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("png"),
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
}
