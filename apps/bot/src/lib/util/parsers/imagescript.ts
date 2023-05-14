import { container } from "@sapphire/pieces";
import { BaseParser, type IParser, Context } from "tagscript";

/**
 * Runs imagescript code (Javascript only)
 *
 * Aliases: imgscript
 *
 * @example
 * ```yaml
 *  {imagescript:code}
 * ```
 */
export class ImagescriptParser extends BaseParser implements IParser {
	public constructor() {
		super(["imagescript", "imgscript"], false, true);
	}

	public async parse(ctx: Context) {
		const { image } = await container.image.imagescript(ctx.tag.payload!);

		if (!image) throw new Error("image returned nothing");

		ctx.response.actions.files = [image];

		return "";
	}
}
