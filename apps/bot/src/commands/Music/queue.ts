import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { EmbedBuilder } from "discord.js";
import { accentColor } from "../../lib/util";
import { chunk } from "@sapphire/utilities";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('queue').setDescription('Show the current queue')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});
		const player = this.container.kazagumo.getPlayer(interaction.guildId);

		if (!interaction.member.voice.channel)
			return interaction.editReply(
				await resolveKey(
					interaction.guild,
					"commands/music:playUserNotInVoice",
				),
			);

		if (!player || !player.queue)
			return await interaction.editReply(
				await resolveKey(interaction.guild, "commands/music:noQueue"),
			);

		const records = player.queue.map(
			(track) => `[${track.position}] ${track.title} ${track.isStream && "🔴"}`,
		);

		return await this.queue(records).run(interaction);
	}

	private queue(records: string[]) {
		const pagination = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(accentColor)
				.setTitle("Guild queue")
				.setFooter({ text: ` Total tracks: ${records.length}` }),
		});

		const pages = chunk(records, 10);

		for (const pageRecords of pages) {
			pagination.addPageEmbed((embed) =>
				embed //
					.setDescription(pageRecords.join("\n")),
			);
		}

		return pagination;
	}
}
