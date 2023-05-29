import {
	InteractionHandler,
	InteractionHandlerTypes,
	type PieceContext,
	Result,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { type ModalSubmitInteraction } from "discord.js";

export class ModalHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== "@tag/add") return this.none();

		const name = interaction.fields.getTextInputValue("name");
		const content = interaction.fields.getTextInputValue("content");

		return this.some({ name, content });
	}

	public async run(
		interaction: ModalSubmitInteraction<"cached">,
		{ name, content }: InteractionHandler.ParseResult<this>,
	) {
		await interaction.deferReply({ fetchReply: true });

		const tag = await Result.fromAsync(
			async () =>
				await this.container.utilities.database.tagCreate(
					name,
					content,
					interaction.guildId,
					interaction.user.id,
				),
		);

		tag.unwrapOrElse(async (error) => {
			console.log(error);
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/tag:tagAlreadyExists"),
			);
		});

		return interaction.editReply(
			await resolveKey(interaction.guild, "commands/tag:tagAddOk"),
		);
	}
}
