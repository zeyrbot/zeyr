import { ApplyOptions } from "@sapphire/decorators";
import {
	InteractionHandler,
	InteractionHandlerTypes
} from "@sapphire/framework";
import type { AutocompleteInteraction } from "discord.js";
import { Client as Urban } from "@zeyrbot/urbandictionary";

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(
		interaction: AutocompleteInteraction,
		result: InteractionHandler.ParseResult<this>
	) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (
			interaction.commandName === "web" &&
			interaction.options.getSubcommand(true) === "urban"
		)
			return this.none();

		const option = interaction.options.getFocused(true);

		switch (option.name) {
			case "term": {
				if (option.value.length === 0) return this.none();

				const ud = new Urban();
				const autocomplete = await ud.autocomplete(option.value);

				console.log(autocomplete);

				return this.some(
					autocomplete.map((match) => ({ name: match, value: match }))
				);
			}
			default:
				return this.none();
		}
	}
}
