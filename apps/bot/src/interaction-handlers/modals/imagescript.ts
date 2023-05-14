import {
	InteractionHandler,
	InteractionHandlerTypes,
	type PieceContext,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { AttachmentBuilder, type ModalSubmitInteraction } from "discord.js";
import { generateOptimisedName } from "../../lib/util";
import { Stopwatch } from "@sapphire/stopwatch";

export class ModalHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== "@util/imagescript") return this.none();

		const code = interaction.fields.getTextInputValue("code");
		const inject = interaction.fields.getTextInputValue("inject");

		return this.some({ code, inject });
	}

	public async run(
		interaction: ModalSubmitInteraction<"cached">,
		{ code, inject }: InteractionHandler.ParseResult<this>,
	) {
		await interaction.deferReply({ fetchReply: true });

		const stopwatch = new Stopwatch();

		const data = await this.container.image.eval(
			code,
			inject ? JSON.parse(inject) : undefined,
		);

		const buffer = data.image;
		const file = new AttachmentBuilder(buffer!, {
			name: generateOptimisedName(data.format ?? "png"),
		});

		return await interaction.editReply({
			content: (await resolveKey(
				interaction.guild,
				"general:stopwatchFinished",
				{
					time: stopwatch.stop().toString(),
				},
			)) as string,
			files: [file],
		});
	}
}
