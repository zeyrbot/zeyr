import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('current').setDescription('Show the current song')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const player = this.container.kazagumo.getPlayer(interaction.guildId);

		if (!player || !player.queue)
			return await interaction.reply(
				await resolveKey(interaction.guild, "commands/music:noQueue"),
			);

		return await interaction.reply(
			await resolveKey(interaction.guild, "commands/music:currentCurrent", {
				track: player.queue.current?.title,
			}),
		);
	}
}
