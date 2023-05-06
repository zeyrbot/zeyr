import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('play').setDescription('Play a song')
        .addStringOption((s) => s.setName("name").setDescription("Name of the song to play").setRequired(true))
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const name = interaction.options.getString("name", true);

		if (!interaction.member.voice.channel)
			return interaction.editReply(
				await resolveKey(
					interaction.guild,
					"commands/music:playUserNotInVoice",
				),
			);

		const player = await this.container.kazagumo.createPlayer({
			guildId: interaction.guildId,
			textId: interaction.channel!.id,
			voiceId: interaction.member.voice.channel.id,
			deaf: true,
			shardId: 0,
		});

		const result = await this.container.kazagumo.search(name, {
			requester: interaction.user,
			nodeName: "europe",
		});

		if (!result.tracks.length)
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/music:playSongNotFound"),
			);

		switch (result.type) {
			case "PLAYLIST":
				for (const track of result.tracks) player.queue.add(track);
				break;

			default:
				player.queue.add(result.tracks[0]);
				break;
		}

		const isNotPlaying = !player.playing && !player.paused;

		if (isNotPlaying) {
			await player.play();
		}

		return interaction.editReply(
			await resolveKey(
				interaction.guild,
				result.type === "PLAYLIST"
					? "commands/music:playQueuePlaylistUpdated"
					: "commands/music:playQueueUpdated",
				{
					track: result.tracks[0].title,
				},
			),
		);
	}
}
