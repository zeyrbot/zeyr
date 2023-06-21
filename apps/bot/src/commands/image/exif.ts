import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import { codeBlock, objectEntries } from "@sapphire/utilities";

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
			size: this.formatBytes(size ?? 0, 2),
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

	public formatBytes(bytes: number, decimals = 2): string {
		if (bytes === 0) return "0 bytes";

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = [" bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]].join(
			""
		);
	}
}
