import { cdn } from "../../lib/util/common/performance";
import { Urbandictionary } from "../../lib/util/wrappers/urbandictionary";
import type { UrbanTerm } from "../../lib/util/wrappers/urbandictionary/types";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { UserError } from "@sapphire/framework";
import { EmbedBuilder } from "discord.js";

@RegisterSubCommand("util", (builder) =>
	builder
		.setName("urbandictionary")
		.setDescription("Search definitions on Urbandictionary")
		.addStringOption((s) =>
			s.setName("term").setDescription("Term to search for").setRequired(true),
		),
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const term = interaction.options.getString("term", true);

		const { list } = await this.ud.define(term);

		if (!list || list.length <= 0) {
			throw new UserError({
				message: "No definitions",
				identifier: "UrbandictionaryNoDefinitions",
			});
		}

		return await this.pagination(list).run(interaction);
	}

	public pagination(list: UrbanTerm[]) {
		const definition = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(Colors.SKY_500)
				.setThumbnail(
					cdn(
						"https://raw.githubusercontent.com/zeyrbot/assets/main/images/information_2139-fe0f.png",
					),
				),
		});

		for (const item of list) {
			definition.addPageEmbed((embed) =>
				embed //
					.setDescription(this.parseMaskedLinks(item.definition))
					.setTitle("Urbandictionary")
					.setAuthor({
						name: item.word,
						url: item.permalink,
					})
					.setFooter({
						text: ` ${item.author}`,
					})
					.addFields([
						{
							name: "📋",
							value: this.parseMaskedLinks(item.example),
						},
						{
							name: "👍",
							value: item.thumbs_up.toString(),
							inline: true,
						},
						{
							name: "👎",
							value: item.thumbs_down.toString(),
							inline: true,
						},
					]),
			);
		}

		return definition;
	}

	private parseMaskedLinks(toParse: string) {
		return toParse.replace(
			this.maskRegex,
			"[$1](https://www.urbandictionary.com/define.php?term=s)",
		);
	}

	private maskRegex = /\[([\w\s!#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~]+)\]/g;

	private ud = new Urbandictionary();
}
