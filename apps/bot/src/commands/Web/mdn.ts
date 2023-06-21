import { Apis } from "../../lib/enums/apis";
import type { MDNResponse } from "../../lib/types/mdn";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { UserError } from "@sapphire/framework";
import { Result } from "@sapphire/result";
import { cast } from "@sapphire/utilities";
import { type ColorResolvable, EmbedBuilder } from "discord.js";

@RegisterSubCommand("web", (builder) =>
	builder
		.setName("mdn")
		.setDescription("Search through MDN documentation")
		.addStringOption((s) =>
			s.setName("query").setDescription("Search query").setRequired(true)
		)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const query = interaction.options.getString("query", true);

		const requestUrl = new URL(Apis.MDN);
		requestUrl.searchParams.append("q", query);

		const result = await Result.fromAsync(
			async () => await fetch<MDNResponse>(requestUrl, FetchResultTypes.JSON)
		);

		const mdn = result.unwrapOrElse(() => {
			throw new UserError({
				message: "I didn't find any results for that query",
				identifier: "MdnNoResults"
			});
		});

		const embed = new EmbedBuilder()
			.setColor(cast<ColorResolvable>(mdn.color))
			.setTitle(mdn.title)
			.setURL(mdn.url)
			.setDescription(mdn.description)
			.setAuthor({
				url: mdn.author.url,
				iconURL: mdn.author.icon_url,
				name: mdn.author.name
			});

		return interaction.reply({
			embeds: [embed]
		});
	}
}
