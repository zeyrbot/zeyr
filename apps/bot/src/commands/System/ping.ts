import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";

@RegisterSubCommand("system", (builder) =>
	builder.setName("ping").setDescription("Zeyr latency statistics")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		return await this.ping(interaction);
	}

	private async db() {
		const start = Date.now();
		await this.container.prisma.$queryRaw`SELECT 1`;
		return Date.now() - start;
	}

	private async ping(interaction: Command.ChatInputInteraction<"cached">) {
		const pingMessage = await interaction.reply({
			content: (await resolveKey(
				interaction.guild,
				"commands/system:pingWait"
			)) as string,
			fetchReply: true
		});

		const ws = Math.round(this.container.client.ws.ping);
		const latency = pingMessage.createdTimestamp - interaction.createdTimestamp;
		const db = await this.db();

		const content = await resolveKey(
			interaction.guild,
			"commands/system:pingDone",
			{
				ws,
				latency,
				db
			}
		);

		return interaction.editReply({
			content
		});
	}
}
