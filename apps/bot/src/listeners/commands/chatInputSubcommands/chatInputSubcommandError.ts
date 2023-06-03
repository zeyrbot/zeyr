import { Listener, type UserError } from "@sapphire/framework";
import {
	type ChatInputSubcommandErrorPayload,
	SubcommandPluginEvents
} from "@sapphire/plugin-subcommands";

export class UserEvent extends Listener<
	typeof SubcommandPluginEvents.ChatInputSubcommandError
> {
	public async run(error: UserError, context: ChatInputSubcommandErrorPayload) {
		const { name, location } = context.command;
		let errorMessage = "❎ ";

		switch (error.identifier) {
			default:
				errorMessage += error.message;
				break;
		}

		// big todo: localize every possible error message (insane)

		this.container.logger.error(
			`Encountered error on chat input command "${name}" at path "${location.full}"`,
			error
		);
		return context.interaction[
			context.interaction.deferred ? "editReply" : "reply"
		]({
			content: errorMessage,
			ephemeral: true
		});
	}
}
