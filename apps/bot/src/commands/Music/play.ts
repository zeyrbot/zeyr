import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('play').setDescription('Play a song')
        .addStringOption((s) => s.setName("query").setDescription("Query to search for").setRequired(true))
        .addStringOption((s) => s.setName("provider").setDescription("Music provider, defaults to \"spotify\"").setRequired(false)
		.addChoices(
			{
				name: "Spotify",
				value: "spotify"
			},
			{
				name: "Deezer",
				value: "deezer"
			}
		)
		)
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});

		const query = interaction.options.getString("query", true);
		const provider = interaction.options.getString("provider") ?? "spotify";

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

		const result = await this.container.kazagumo.search(query, {
			requester: interaction.user,
			nodeName: "North America",
			engine: provider,
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
