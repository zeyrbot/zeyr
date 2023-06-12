import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { codeBlock, objectEntries, roundNumber } from "@sapphire/utilities";

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
			content: "Waiting...",
			fetchReply: true
		});

		const pings = {
			ws: roundNumber(this.container.client.ws.ping),
			interactions: pingMessage.createdTimestamp - interaction.createdTimestamp,
			database: await this.db()
		};

		return interaction.editReply({
			content: codeBlock(
				objectEntries(pings)
					.map(([key, value]) => `${key}: ${value}ms`)
					.join("\n")
			)
		});
	}
}
