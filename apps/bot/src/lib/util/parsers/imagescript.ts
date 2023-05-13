import { BaseParser, type IParser, Context } from "tagscript";
import { PXLAPI } from "../../util/apis";

/**
 * Runs imagescript code (Javascript only)
 *
 * Aliases: imgscript
 *
 * @example
 * ```yaml
 * no.
 * ```
 */
export class ImagescriptParser extends BaseParser implements IParser {
	public constructor() {
		super(["imagescript", "imgscript"], false, true);
	}

	public async parse(ctx: Context) {
		const buffer = await this.pxlapi.imagescript(ctx.tag.payload!);

		ctx.response.actions.files = [Buffer.from(buffer)];

		return "";
	}

	private pxlapi = new PXLAPI(process.env.PXLAPI_KEY!);
}
