import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import type { Member, Tag } from "@prisma/client";
import { UserError } from "@sapphire/framework";
import { Result } from "@sapphire/result";

@RegisterSubCommand("tag", (builder) =>
	builder
		.setName("view")
		.setDescription("View a tag")
		.addStringOption((o) =>
			o.setName("name").setDescription("Tag's name").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const name = interaction.options.getString("name", true);

		const tag_result = await Result.fromAsync(
			async () =>
				await this.container.utilities.tag.get(name, interaction.guildId)
		);

		const tag = (await tag_result.unwrapOrElse(async () => {
			throw new UserError({
				identifier: "TagViewFailed",
				message: "The tag does not exists",
				context: {
					silent: true
				}
			});
		})) as Tag & {
			author: Member;
		};

		const parsed = await this.container.utilities.parsers.parse(
			interaction,
			tag.content
		);

		const files = this.container.utilities.parsers.parseFiles(parsed);
		const embeds = this.container.utilities.parsers.parseEmbeds(parsed);

		await this.container.utilities.tag.incrementUsage(tag.id);

		return interaction.reply({
			content: parsed.body ?? "no text",
			embeds,
			files
		});
	}
}
