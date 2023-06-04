import { optimalFileName } from "../../lib/util";
import {
	InteractionHandler,
	InteractionHandlerTypes,
	type PieceContext
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder, type ModalSubmitInteraction } from "discord.js";

export class ModalHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit
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
		{ code, inject }: InteractionHandler.ParseResult<this>
	) {
		await interaction.deferReply({ fetchReply: true });

		const stopwatch = new Stopwatch();

		try {
			const { image, format } = await this.container.utilities.image.eval(
				code,
				inject ? JSON.parse(inject) : undefined
			);

			const file = new AttachmentBuilder(image!, {
				name: optimalFileName(format ?? "png")
			});

			return interaction.editReply({
				content: cast<string>(
					await resolveKey(interaction.guild, "general:stopwatchFinished", {
						time: stopwatch.stop().toString()
					})
				),
				files: [file]
			});
		} catch (e) {
			return interaction.editReply({
				content: `❎ ${cast<Error>(e).message}`
			});
		}
	}
}
