import { Listener, type UserError } from "@sapphire/framework";
import {
	type ChatInputSubcommandErrorPayload,
	SubcommandPluginEvents
} from "@sapphire/plugin-subcommands";
import { err } from "../../../lib/util";

export class UserEvent extends Listener<
	typeof SubcommandPluginEvents.ChatInputSubcommandError
> {
	public async run(error: UserError, context: ChatInputSubcommandErrorPayload) {
		const { name, location } = context.command;

		this.container.logger.error(
			`Encountered error on chat input command "${name}" at path "${location.full}"`,
			error
		);
		return context.interaction[
			context.interaction.deferred ? "editReply" : "reply"
		]({
			content: err(error.message),
			ephemeral: true
		});
	}
}
