import { lastMedia } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { codeBlock, objectEntries } from "@sapphire/utilities";
import { formatBytes } from "@zeyr/utils";

@RegisterSubCommand("util", (builder) =>
	builder
		.setName("exif")
		.setDescription("Visualize in a human readable way image metadata")
		.addAttachmentOption((option) =>
			option.setName("image").setDescription("Image").setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		if (!image)
			return interaction.editReply("Please provide a valid image or url");

		const buffer = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url
		);

		const { size, format: mimetype, width, height } = await buffer.metadata();

		const data = {
			mimetype,
			size: formatBytes(size ?? 0, 2),
			dimensions: `${width}x${height}`
		};

		return interaction.editReply({
			content: codeBlock(
				objectEntries(data)
					.map(([type, value]) => `${type}: ${value}`)
					.join("\n")
			)
		});
	}
}
