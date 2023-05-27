import { customId, optimiseGithubCDN } from "../../lib/util";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand,
} from "@kaname-png/plugin-subcommands-advanced";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { pickRandom } from "@sapphire/utilities";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";

@RegisterSubCommand('util', (builder) =>
	builder
		.setName('trivia')
		.setDescription('Play a quick trivia game')
		.addStringOption(option => option.setName('category').setDescription('What kind of questions should I ask?').setRequired(true)
		.addChoices(
			{
				name: "Random",
				value: "random"
			},
			{
				name: "Animals",
				value: "animals"
			},
			{
				name: "General",
				value: "general"
			},
			{
				name: "History",
				value: "history"
			}
		))
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">,
	) {
		const category = interaction.options.getString("category", true);

		const triviaUrl = optimiseGithubCDN(
			`https://raw.githubusercontent.com/zeyrbot/assets/main/json/trivia/${
				category === "random" ? pickRandom(this.categories) : category
			}.json`,
		);
		const triviaData = await fetch<Trivia[]>(triviaUrl, FetchResultTypes.JSON);
		const trivia = pickRandom(triviaData);

		const answers = new ActionRowBuilder<ButtonBuilder>();

		for (const choice of trivia.choices) {
			answers.addComponents(
				new ButtonBuilder()
					.setCustomId(
						customId(
							"/",
							"@trivia",
							interaction.user.id,
							choice,
							trivia.answer,
						),
					)
					.setLabel(choice)
					.setStyle(ButtonStyle.Primary),
			);
		}

		const question = new EmbedBuilder()
			.setColor(Colors.SKY_500)
			.setTitle("Trivia")
			.setDescription(trivia.question)
			.setFooter({
				text: "Press the correct button below",
			});

		return interaction.reply({
			embeds: [question],
			components: [answers],
		});
	}

	private categories = ["animals", "general", "history"];
}

export interface Trivia {
	question: string;
	category: string;
	answer: string;
	choices: string[];
}
