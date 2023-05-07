import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder } from "discord.js";
import { accentColor } from "../../lib/util";
import { State } from "kazagumo";

@ApplyOptions<Command.Options>({
    registerSubCommand: {
        parentCommandName: 'music',
        slashSubcommand: (builder) => builder.setName('nodes').setDescription('Check status of available nodes')
    }
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const nodes = this.container.kazagumo.shoukaku.nodes.entries();

		const nodeEmbed = new EmbedBuilder()
			.setColor(accentColor)
			.setTitle("Player nodes")
			.setThumbnail(interaction.guild.iconURL())
			.setDescription(
				Array.from(
					nodes,
					([id, node]) =>
						`${node.state === State.CONNECTED ? "✅" : "❎"} ${id} (${
							node.stats?.cpu.cores
						} cores)`,
				).join("\n"),
			);

		return await interaction.reply({
			embeds: [nodeEmbed],
		});
	}
}
