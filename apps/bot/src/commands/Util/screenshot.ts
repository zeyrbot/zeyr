import { APIS, optimiseGithubCDN } from "../../lib/util";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Stopwatch } from "@sapphire/stopwatch";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";

@RegisterSubCommand('util', (builder) =>
	builder
		.setName('screenshot')
		.setDescription('Take a screenshot of a website')
		.addStringOption(option => option.setName('url').setDescription('URL of the website').setRequired(true))
		.addBooleanOption(option => option.setName('fullpage').setDescription('Should screenshot full page').setRequired(false))
		.addNumberOption(option => option.setName('wait').setDescription('Wait time before screenshot').setRequired(false))
		.addNumberOption(option => option.setName('width').setDescription('Width of the screenshot').setRequired(false))
		.addNumberOption(option => option.setName('height').setDescription('Height of the screenshot').setRequired(false))
		.addStringOption(option => option.setName('format').setDescription('Format of the output').setRequired(false).addChoices({
			name: 'png',
			value: 'png'
		},
		{
			name: 'jpeg',
			value: 'jpeg'
		}
		)
	)
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		await interaction.deferReply({ fetchReply: true });

		const stopwatch = new Stopwatch();

		const url = interaction.options.getString("url", true);
		const fullpage = interaction.options.getBoolean("fullpage") ?? false;
		const wait = interaction.options.getNumber("wait") ?? 100;
		const width = interaction.options.getNumber("width") ?? 1280;
		const height = interaction.options.getNumber("height") ?? 900;
		const format = interaction.options.getString("format") ?? "png";

		const badUrls = await fetch<string[]>(this.bad, FetchResultTypes.JSON);

		if (badUrls.includes(url))
			return interaction.editReply(
				await resolveKey(interaction.guild, "commands/util:screenshotBadUrl", {
					list: optimiseGithubCDN(
						"https://raw.githubusercontent.com/zeyrbot/assets/main/json/websites.json",
					),
				}),
			);

		const requestUrl = new URL(APIS.SCREENSHOT);

		requestUrl.searchParams.append("resX", width.toString());
		requestUrl.searchParams.append("resY", height.toString());
		requestUrl.searchParams.append("outFormat", format);
		requestUrl.searchParams.append("waitTime", wait.toString());
		requestUrl.searchParams.append("isFullPage", fullpage.toString());
		requestUrl.searchParams.append("url", url);

		const imageResult = await fetch(requestUrl, FetchResultTypes.Buffer);

		const file = new AttachmentBuilder(
			Buffer.from(imageResult as ArrayBuffer),
			{
				name: `screenshot.${format}`,
			},
		);

		return interaction.editReply({
			content: cast<string>(
				await resolveKey(interaction.guild, "general:stopwatchFinished", {
					time: stopwatch.stop().toString(),
				}),
			),
			files: [file],
		});
	}

	private bad = optimiseGithubCDN(
		"https://raw.githubusercontent.com/zeyrbot/assets/main/json/websites.json",
	);
}
