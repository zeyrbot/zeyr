import { info } from "../../lib/util";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { UserError } from "@sapphire/framework";
import { Result } from "@sapphire/result";
import { cast, roundNumber } from "@sapphire/utilities";
import { type Bot, Client as Dlist } from "@zeyrbot/dlist";

@RegisterSubCommand("system", (builder) =>
	builder.setName("vote").setDescription("Vote fot Zeyr")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const stats = await Result.fromAsync(async () => await this.dlist.getBot());

		const result = stats.unwrapOrElse((e) => {
			throw new UserError({
				identifier: "VoteFail",
				message: cast<Error>(e).message
			});
		}) as Bot;

		return interaction.reply(
			info(
				"You can vote for Zeyr on [discordlist.gg](https://discordlist.gg/bot/1095425642159407165/vote?action=vote)\nZeyr currently has !{} votes (!{} all time)",
				roundNumber(result.votes),
				result.allTimeVotes
			)
		);
	}

	public dlist: Dlist = new Dlist({
		id: "1095425642159407165",
		token: process.env.DLIST_KEY
	});
}
