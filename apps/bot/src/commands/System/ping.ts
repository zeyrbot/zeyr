import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";

@ApplyOptions<Command.Options>({
  registerSubCommand: {
    parentCommandName: "system",
    slashSubcommand: (builder) =>
      builder.setName("ping").setDescription("Display Zeyr latency"),
  },
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction,
	) {
		return await this.ping(interaction);
	}

	private async db() {
		const start = Date.now();
		await this.container.prisma.$queryRaw`SELECT 1`;
		return Date.now() - start;
	}

	private async ping(interaction: Command.ChatInputInteraction) {
		const pingMessage = await interaction.reply({
			content: (await resolveKey(
				interaction.guild!,
				"commands/system:pingWait",
			)) as string,
			fetchReply: true,
		});

		const ws = Math.round(this.container.client.ws.ping);
		const latency = pingMessage.createdTimestamp - interaction.createdTimestamp;
		const db = await this.db();

		const content = await resolveKey(
			interaction.guild!,
			"commands/system:pingDone",
			{
				ws,
				latency,
				db,
			},
		);

		return interaction.editReply({
			content,
		});
	}
}
