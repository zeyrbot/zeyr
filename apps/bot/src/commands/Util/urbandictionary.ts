import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { Urbandictionary } from "../../lib/util/apis";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { EmbedBuilder } from "discord.js";
import { UserError } from "@sapphire/framework";
import { Colors } from "@discord-factory/colorize";
import type { Term } from "../../lib/types/apis";
import { optimiseGithubCDN } from "../../lib/util";

@RegisterSubCommand('util', (builder) =>
	builder
		.setName("urbandictionary")
		.setDescription("Search definitions on Urbandictionary")
		.addStringOption((s) =>
			s.setName("term").setDescription("Term to search for").setRequired(true)
		)
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

	public pagination(list: Term[]) {
		const definition = new PaginatedMessage({
			template: new EmbedBuilder()
				.setColor(Colors.SKY_500)
				.setThumbnail(
					optimiseGithubCDN(
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
