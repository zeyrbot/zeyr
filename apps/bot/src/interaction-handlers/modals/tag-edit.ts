import { ok } from "../../lib/util";
import { ApplyOptions } from "@sapphire/decorators";
import {
	InteractionHandler,
	InteractionHandlerTypes,
	Result,
	UserError
} from "@sapphire/framework";
import { ComponentType, type ModalSubmitInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
	name: "edit",
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public override parse(interaction: ModalSubmitInteraction) {
		const id = interaction.customId.split("/");

		if (id[0] !== "@tag" && id[1] !== "edit") return this.none();

		const name = id.pop()!;
		const content = interaction.fields.getField(
			"newcontent",
			ComponentType.TextInput
		);

		return this.some({
			name,
			content
		});
	}

	public async run(
		interaction: ModalSubmitInteraction<"cached">,
		{ name, content }: InteractionHandler.ParseResult<this>
	) {
		await interaction.deferReply({ fetchReply: true });

		const tag = await Result.fromAsync(
			async () =>
				await this.container.utilities.tag.get(name, interaction.guildId)
		);

		tag.unwrapOrElse(() => {
			throw new UserError({
				identifier: "TagMissing",
				message: "The tag does not exist"
			});
		});

		await this.container.utilities.tag.update(
			{
				id: tag.unwrap()?.id
			},
			{
				content: content.value
			}
		);

		return interaction.editReply({
			content: ok("Tag `!{}` has been edited", name)
		});
	}
}
