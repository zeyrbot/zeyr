import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";
import { developers } from "../lib/util";

export class UserPrecondition extends Precondition {
	public readonly message =
		"You lack the permissions required to perform this action";

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return developers.includes(interaction.user.id)
			? this.ok()
			: this.error({
					message: this.message,
					identifier: "DeveloperPrecondition"
			  });
	}
}
