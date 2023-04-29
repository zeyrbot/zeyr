import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Interpreter, Response } from "tagscript";
import { tagParsers } from "../../lib/util";

@ApplyOptions<Command.Options>({
  registerSubCommand: {
    parentCommandName: "tag",
    slashSubcommand: (builder) =>
      builder
        .setName("show")
        .setDescription("Subcommand description")
        .addStringOption((s) =>
          s.setName("name").setDescription("Name of the tag").setRequired(true)
        ),
  },
})
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction,
	) {
		const name = interaction.options.getString("name", true);

		const tag = await this.container.prisma.tag.findFirst({
			where: {
				name,
				guildId: interaction.guildId!,
			},
		});

		if (!tag) {
			return interaction.reply(
				await resolveKey(interaction.guild!, "commands/tag:tagNotFound"),
			);
		}

		const interpreter = new Interpreter(...tagParsers);
		const content = (await interpreter
			.run(tag.content)
			.catch(async () =>
				interaction.reply(
					await resolveKey(
						interaction.guild!,
						"commands/tag:tagUnexpectedError",
					),
				),
			)) as Response;

		return interaction.reply(
			content.body ??
				(await resolveKey(
					interaction.guild!,
					"commands/tag:tagUnexpectedError",
				)),
		);
	}
}
