import { customId } from "../../lib/util";
import { ApplyOptions } from "@sapphire/decorators";
import {
	InteractionHandler,
	InteractionHandlerTypes,
} from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(
		interaction: ButtonInteraction,
		{ choice, answer }: InteractionHandler.ParseResult<this>,
	) {
		if (choice === answer) {
			return interaction.reply({
				content: "Very nice! Your answer is correct",
			});
		} else {
			return interaction.reply({
				content: "Oops, that's not correct, good luck next time",
			});
		}
	}

	public override parse(interaction: ButtonInteraction) {
		console.log(1);
		const id = interaction.customId.split("/").splice(0, 2).join("/");

		console.log(id);
		console.log(customId("/", "@trivia", interaction.user.id));

		if (id !== customId("/", "@trivia", interaction.user.id))
			return this.none();
		console.log(2);

		const choice = interaction.customId.split("/").splice(2, 1).join("");
		const answer = interaction.customId.split("/").splice(3).join("");

		console.log(choice, answer, interaction.customId.split("/"));

		return this.some({ choice, answer });
	}
}
