import { Listener, type UserError } from "@sapphire/framework";
import {
	type ChatInputSubcommandErrorPayload,
	SubcommandPluginEvents
} from "@sapphire/plugin-subcommands";
import { err } from "../../../lib/util";

export class UserEvent extends Listener<
	typeof SubcommandPluginEvents.ChatInputSubcommandError
> {
	public async run(
		{ context, message: content }: UserError,
		{ interaction }: ChatInputSubcommandErrorPayload
	) {
		if (Reflect.get(Object(context), "silent")) return;

		this.container.logger.fatal(context, content);

		if (interaction.deferred || interaction.replied) {
			return interaction.editReply({
				content: err(content),
				allowedMentions: { users: [interaction.user.id], roles: [] }
			});
		}

		return interaction.reply({
			content: err(content),
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true
		});
	}
}
