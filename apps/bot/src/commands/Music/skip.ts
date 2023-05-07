import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('skip').setDescription('Skip to next song in queue')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const player = this.container.kazagumo.getPlayer(interaction.guildId)!;

		if (!interaction.member.voice.channel)
			return interaction.editReply(
				await resolveKey(
					interaction.guild,
					"commands/music:playUserNotInVoice",
				),
			);

		if (!player || !player.queue)
			return interaction.reply(
				await resolveKey(interaction.guild, "commands/music:skipNoQueue"),
			);

		player.skip();

		return interaction.reply(
			await resolveKey(interaction.guild, "commands/music:skipSkipped"),
		);
	}
}
