import {
	BaseParser,
	type IParser,
	Context,
	SafeObjectTransformer,
} from "tagscript";

/**
 * Fetchs an endpoint
 *
 * Aliases: fetch
 *
 * @example
 * ```yaml
 * {fetch:URL}
 * ```
 */
export class FetchParser extends BaseParser implements IParser {
	public constructor() {
		super(["fetch"], true, true);
	}

	public async parse(ctx: Context) {
		const data = await (await fetch(ctx.tag.payload!)).text();

		ctx.response.variables[ctx.tag.parameter!] = new SafeObjectTransformer(
			data,
		);
		return "";
	}
}
