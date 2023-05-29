import { Valorant } from "../../../lib/util/wrappers/valorant";
import { Colors } from "@discord-factory/colorize";
import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";
import { resolveKey } from "@sapphire/plugin-i18next";
import { EmbedBuilder } from "discord.js";

@RegisterSubCommandGroup("game", "valorant", (builder) =>
	builder
		.setName("account")
		.setDescription("Display an user and it's information")
		.addStringOption((s) =>
			s.setName("name").setDescription("Account name").setRequired(true),
		)
		.addStringOption((s) =>
			s.setName("tag").setDescription("Account tag").setRequired(true),
		),
)
export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});
		const name = interaction.options.getString("name", true);
		const tag = interaction.options.getString("tag", true);

		const { status, data: account } = await this.valorant.account(name, tag);

		if (status !== 200)
			return interaction.editReply(
				await resolveKey(
					interaction.guild,
					"commands/game:valorantAccountNotFound",
				),
			);

		const { data: mmr } = await this.valorant.mmr(
			account.region,
			account.name,
			account.tag,
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.SKY_500)
			.setTitle(`${account.name}#${account.tag}`)
			.setThumbnail(account.card.small)
			.setImage(account.card.wide)
			.setDescription(
				await resolveKey(
					interaction.guild,
					"commands/game:valorantAccountWatching",
					{
						name,
					},
				),
			)
			.addFields([
				{
					name: "Elo",
					value: String(mmr.current_data.elo),
				},
				{
					name: await resolveKey(
						interaction.guild,
						"commands/game:valorantMMRCurrentTier",
					),
					value: mmr.current_data.currenttierpatched,
				},
			])
			.setFooter({
				text: account.puuid,
			});

		return interaction.editReply({
			embeds: [embed],
		});
	}

	private valorant = new Valorant();
}
