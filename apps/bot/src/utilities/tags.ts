import { FetchParser, NSFWParser } from "../lib/structures/parsers";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";
import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	type IParser,
	IfStatementParser,
	IncludesParser,
	Interpreter,
	JSONVarParser,
	LooseVarsParser,
	OrdinalFormatParser,
	RandomParser,
	RangeParser,
	ReplaceParser,
	SliceParser,
	StrictVarsParser
} from "tagscript";
import {
	DeleteParser,
	EmbedParser,
	FilesParser
} from "tagscript-plugin-discord";

@ApplyOptions<Utility.Options>({
	name: "tags"
})
export class TagsUtility extends Utility {
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

	public interpreter = new Interpreter();

	public async parse(interpreter: Interpreter, text: string) {
		return interpreter.run(text);
	}
}
