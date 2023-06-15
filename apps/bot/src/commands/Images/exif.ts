import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import { codeBlock, objectEntries } from "@sapphire/utilities";
import { formatBytes } from "@shared/format-utilities";

@RegisterSubCommand("image", (builder) =>
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
		const image = await this.container.utilities.image.getMedia(
			interaction,
			"image"
		);

		if (!image)
			throw new UserError({
				identifier: "ImageInvalid",
				message: "Please provide a valid image or url"
			});

		const buffer = await this.container.utilities.image.sharp(
			image.proxyURL ?? image.url
		);

		const { size, format: mimetype, width, height } = await buffer.metadata();

		const data = {
			mimetype,
			size: formatBytes(size ?? 0, 2),
			dimensions: `${width}x${height}`
		};

		return await interaction.reply({
			content: codeBlock(
				objectEntries(data)
					.map(([type, value]) => `${type}: ${value}`)
					.join("\n")
			)
		});
	}
}
