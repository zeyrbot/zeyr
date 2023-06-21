import { getLastAttachment, ok, optimalFileName } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import { AttachmentBuilder } from "discord.js";
import ytdl from "ytdl-core";

@RegisterSubCommand("tools", (builder) =>
	builder
		.setName("download")
		.setDescription("Download any media by its url")
		.addStringOption((s) =>
			s.setName("url").setDescription("Media url").setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const url =
			interaction.options.getString("url") ??
			(await getLastAttachment(interaction?.channel!))?.proxyURL;

		if (!url)
			throw new UserError({
				identifier: "DownloadUrlInvalid",
				message: "The url/attachment provided is invalid"
			});

		const isYtUrl = ytdl.validateURL(url);
		const isVideoUrl = /.mp4/g.test(url);
		//WIP const isAudioUrl = /.mp3/g.test(url)

		if (isYtUrl) {
			const stream = ytdl(url, {
				quality: 60
			});

			const downloaded = new AttachmentBuilder(stream, {
				name: optimalFileName("mp4")
			});

			return interaction.editReply({
				content: ok("Downloaded YouTube video"),
				files: [downloaded]
			});
		}

		if (isVideoUrl) {
			const media = await this.container.utilities.image.getRaw(url);

			const downloaded = new AttachmentBuilder(Buffer.from(media), {
				name: optimalFileName("mp4")
			});

			return interaction.editReply({
				content: ok("Downloaded video"),
				files: [downloaded]
			});
		}

		const media = await this.container.utilities.image.getRaw(url);
		const { format } = await (
			await this.container.utilities.image.sharpFromBuffer(media)
		).metadata();

		const downloaded = new AttachmentBuilder(Buffer.from(media), {
			name: optimalFileName(format ?? "png")
		});

		return interaction.editReply({
			content: ok("Downloaded media"),
			files: [downloaded]
		});
	}
}
