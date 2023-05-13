import { BaseParser, type IParser, Context } from "tagscript";

/**
 * Marks tag as nsfw
 *
 * Aliases: nsfw, restricted
 *
 * @example
 * ```yaml
 * {nsfw}
 * ```
 */
export class NSFWParser extends BaseParser implements IParser {
	public constructor() {
		super(["nsfw", "restricted"]);
	}

	public async parse(ctx: Context) {
		ctx.response.actions.nsfw!.nsfw = true;
		ctx.response.actions.nsfw!.message = ctx.tag.payload ?? "🔞";

		return "";
	}
}
