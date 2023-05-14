import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { Stopwatch } from "@sapphire/stopwatch";
import { lastMedia, optimiseGithubCDN } from "../../lib/util";
import { resolveKey } from "@sapphire/plugin-i18next";
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

		const speech = await this.container.image.decode(this.SPEECH_BALLOON_URL);
		const balloon = await this.container.image.decode(
			image.proxyURL ?? image.url,
		);

		speech.fit(speech.width, speech.height + (balloon.height - 100) * 2);
		speech.composite(balloon.resize(speech.width, balloon.height - 100), 0, 0);
		speech.crop(0, 0, speech.width, speech.height - balloon.height);

		const { buffer } = await speech.encode();
		const file = new AttachmentBuilder(Buffer.from(buffer), {
			name: "speech.gif",
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

	private SPEECH_BALLOON_URL = optimiseGithubCDN(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/images/z0nqjst12ih61.jpg",
	);
}
