import { Subcommand } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry } from "@sapphire/framework";

@ApplyOptions<Subcommand.Options>({
    name: "game"
})
export class ParentCommand extends Subcommand {
	public override registerApplicationCommands(
		registry: ApplicationCommandRegistry,
	) {
		registry.registerChatInputCommand((ctx) => {
			ctx.addSubcommandGroup((sc) =>
				sc.setName("valorant").setDescription("Valorant commands"),
			);

			// this.hooks.subcommands(this, ctx);
			this.hooks.groups(this, ctx);

			return ctx.setName(this.name).setDescription("Game commands");
		});
	}
}
