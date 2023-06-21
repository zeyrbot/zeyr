import { ok } from "../../lib/util";
import { ApplyOptions } from "@sapphire/decorators";
import {
	InteractionHandler,
	InteractionHandlerTypes,
	Result,
	UserError
} from "@sapphire/framework";
import type { ModalSubmitInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
	name: "add",
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public override parse(interaction: ModalSubmitInteraction) {
		const id = interaction.customId.split("/");

		if (id[0] !== "@tag" && id[1] !== "add") return this.none();

		const name = id.pop()!;
		const content = interaction.fields.getTextInputValue("content");

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
				await this.container.utilities.tag.create(
					name,
					content,
					interaction.guildId,
					interaction.user.id
				)
		);

		tag.unwrapOrElse(() => {
			throw new UserError({
				identifier: "TagAddFailed",
				message: "The tag already exists"
			});
		});

		return interaction.editReply({
			content: ok("Tag `!{}` has been created", name)
		});
	}
}
