import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { info } from "../../lib/util";

@RegisterSubCommand("system", (builder) =>
	builder.setName("invite").setDescription("Invite zeyr")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		return interaction.reply(
			info(
				"Thanks for being interested on Zeyr, add it [here](https://invite.bot/4h4dif16bd)"
			)
		);
	}
}
