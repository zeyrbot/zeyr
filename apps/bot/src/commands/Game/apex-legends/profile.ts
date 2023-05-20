import { Command } from "@kaname-png/plugin-subcommands-advanced";
import { RegisterSubCommandGroup } from "@kaname-png/plugin-subcommands-advanced";
import { TrackerGG } from "../../../lib/util";
import type { ApexPlatforms } from "../../../lib/types/apis/tracker";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Colors } from "@discord-factory/colorize";
import { EmbedBuilder } from "discord.js";

@RegisterSubCommandGroup("game", "apex-legends", (builder) => 
	builder
		.setName("profile")
		.setDescription("Lookup an user's info")
		.addStringOption((s) => 
			s
				.setName("platform")
				.setDescription("Platform to search on")
				.setRequired(true)
				.setChoices(
					{
						name: "Steam",
						value: "steam"
					},
					{
						name: "Origin",
						value: "origin"
					},
					{
						name: "XBL",
						value: "xbl"
					},
					{
						name: "Playstation",
						value: "psn"
					}
				)
		)
		.addStringOption((s) => 
			s
				.setName("id")
				.setDescription("Name/Identifier of the profile")
				.setRequired(true)
		)
)export class GroupCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({
			fetchReply: true,
		});
		const platform = interaction.options.getString(
			"platform",
			true,
		) as ApexPlatforms;
		const id = interaction.options.getString("id", true);

		const { data: profile } = await this.tracker.apexProfile(platform, id);

		if (!profile)
			return interaction.editReply(
				await resolveKey(
					interaction.guild,
					"commands/game:apexProfileNotFound",
				),
			);

		const embed = new EmbedBuilder()
			.setColor(Colors.SKY_500)
			.setTitle(profile.platformInfo.platformUserId)
			.setThumbnail(profile.platformInfo.avatarUrl)
			.setDescription("hallo");

		return interaction.editReply({
			embeds: [embed],
		});
	}

	private tracker = new TrackerGG(process.env.TRACKER_GG_KEY!);
}
