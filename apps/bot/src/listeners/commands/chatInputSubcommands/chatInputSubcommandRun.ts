import { Listener } from "@sapphire/framework";
import { SubcommandPluginEvents } from "@sapphire/plugin-subcommands";

export class UserEvent extends Listener<
	typeof SubcommandPluginEvents.ChatInputSubcommandRun
> {
	public async run() {
		// wip
	}
}
