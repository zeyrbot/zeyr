import { Subcommand } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry } from "@sapphire/framework";

@ApplyOptions<Subcommand.Options>({
	name: "util"
})
export class ParentCommand extends Subcommand {
	public override registerApplicationCommands(
		registry: ApplicationCommandRegistry
	) {
		registry.registerChatInputCommand((ctx) => {
			this.hooks.subcommands(this, ctx);

			return ctx.setName(this.name).setDescription("Util commands");
		});
	}
}
