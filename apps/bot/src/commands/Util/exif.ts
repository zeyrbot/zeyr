import { lastMedia } from "../../lib/util";
import { formatBytes } from "../../lib/util";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { cast } from "@sapphire/utilities";
import sharp from "sharp";

@RegisterSubCommand("util", (builder) =>
	builder
		.setName("exif")
		.setDescription("Visualize in a human readable way image metadata")
		.addAttachmentOption((option) =>
			option.setName("image").setDescription("Image").setRequired(false),
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/images:invalidImage"),
			);

		const buffer = await this.container.utilities.image.fetch(
			image.proxyURL ?? image.url,
		);

		const { size, format, width, height } = await sharp(buffer).metadata();

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(interaction.guild, "commands/util:exifOk", {
					mimetype: format,
					size: formatBytes(size ?? 0, 1),
					dimensions: `${width}x${height}`,
				}),
			),
		});
	}
}
