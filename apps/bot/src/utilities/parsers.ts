import { FetchParser, NSFWParser } from "../lib/structures/parsers";
import type { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	type IParser,
	type ITransformer,
	IfStatementParser,
	IncludesParser,
	Interpreter,
	JSONVarParser,
	LooseVarsParser,
	OrdinalFormatParser,
	RandomParser,
	RangeParser,
	ReplaceParser,
	Response,
	SliceParser,
	StrictVarsParser
} from "tagscript";
import {
	ChannelTransformer,
	DeleteParser,
	EmbedParser,
	FilesParser,
	GuildTransformer,
	InteractionTransformer,
	MemberTransformer,
	UserTransformer
} from "tagscript-plugin-discord";

@ApplyOptions<Utility.Options>({
	name: "parsers"
})
export class ParsersUtility extends Utility {
	public parsers: IParser[] = [
		new BreakParser(),
		new DefineParser(),
		new FiftyFiftyParser(),
		new IfStatementParser(),
		new IncludesParser(),
		new JSONVarParser(),
		new LooseVarsParser(),
		new OrdinalFormatParser(),
		new RandomParser(),
		new RangeParser(),
		new ReplaceParser(),
		new SliceParser(),
		new StrictVarsParser(),
		new EmbedParser(),
		new FilesParser(),
		new DeleteParser(),
		new NSFWParser(),
		new FetchParser()
	];

	public async loadParsers() {
		return this.parsers.map((p) => this.interpreter.addParsers(p));
	}

	public loadTransformers(
		interaction: Command.ChatInputInteraction<"cached">
	): Record<string, ITransformer> {
		return {
			channel: new ChannelTransformer(interaction.channel!),
			guild: new GuildTransformer(interaction.guild),
			command: new InteractionTransformer(interaction),
			member: new MemberTransformer(interaction.member),
			user: new UserTransformer(interaction.user)
		};
	}

	public async parse(
		interaction: Command.ChatInputInteraction<"cached">,
		text: string
	) {
		return this.interpreter.run(text, this.loadTransformers(interaction));
	}

	public parseFiles(response: Response) {
		return response.actions.files
			? response.actions.files.map((x) => new AttachmentBuilder(x))
			: undefined;
	}

	public parseEmbeds(response: Response) {
		return response.actions.embed
			? [new EmbedBuilder(response.actions.embed)]
			: undefined;
	}

	public interpreter = new Interpreter();
}
