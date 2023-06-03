import {
	Events,
	type InteractionHandlerParseError,
	Listener
} from "@sapphire/framework";
import type { Interaction } from "discord.js";

export class UserListener extends Listener<
	typeof Events.InteractionHandlerParseError
> {
	public run(error: Error, payload: InteractionHandlerParseError) {
		const { name, location } = payload.handler;
		const errorMessage = `❎ ${error.message}`;

		this.container.logger.error(
			`Encountered error on chat input command "${name}" at path "${location.full}"`,
			error
		);

		return this.respond(payload.interaction, errorMessage);
	}

	private respond(interaction: Interaction, content: string) {
		if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

		if (interaction.replied || interaction.deferred) {
			return interaction.editReply({
				content,
				allowedMentions: { users: [interaction.user.id], roles: [] }
			});
		}

		return interaction.reply({
			content,
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true
		});
	}
}
