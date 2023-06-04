import { cdn, lastMedia, optimalFileName } from "../../lib/util";
import { LanguageKeys } from "../../lib/util/i18n/keys";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";

@RegisterSubCommand("image", (builder) =>
	builder
		.setName("speech-balloon")
		.setDescription("Renders a speech bubble with the given image")
		.addAttachmentOption((o) =>
			o.setName("image").setDescription("🤓🤓").setRequired(false)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		await interaction.deferReply({ fetchReply: true });
		const stopwatch = new Stopwatch();

		const image =
			interaction.options.getAttachment("image") ??
			(await lastMedia(interaction.channel!));

		console.log(image);

		if (!image)
			return interaction.editReply(
				await resolveKey(interaction.guild, LanguageKeys.Images.InvalidImage)
			);

		const balloon = await this.container.utilities.image.decode(
			this.SPEECH_BALLOON_URL
		);
		const speech = await this.container.utilities.image.decode(
			image.proxyURL ?? image.url
		);

		speech.fit(speech.width, speech.height + (balloon.height - 100) * 2);
		speech.composite(balloon.resize(speech.width, balloon.height - 100), 0, 0);
		speech.crop(0, 0, speech.width, speech.height - balloon.height);

		const { buffer } = await speech.encode();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: optimalFileName("gif")
		});

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(
					interaction.guild,
					LanguageKeys.General.StopwatchFinished,
					{
						time: stopwatch.stop().toString()
					}
				)
			),
			files: [file]
		});
	}

	private SPEECH_BALLOON_URL = cdn(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/z0nqjst12ih61.jpg"
	);
}
