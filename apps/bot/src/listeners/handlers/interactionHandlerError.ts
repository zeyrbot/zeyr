import { err } from "../../lib/util";
import {
	Events,
	type InteractionHandlerError,
	Listener,
	type UserError
} from "@sapphire/framework";

export class UserEvent extends Listener<typeof Events.InteractionHandlerError> {
	public async run(
		{ context, message: content }: UserError,
		{ interaction }: InteractionHandlerError
	) {
		if (Reflect.get(Object(context), "silent")) return;

		this.container.logger.fatal(context, content);

		if (interaction.isAutocomplete()) return;

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
