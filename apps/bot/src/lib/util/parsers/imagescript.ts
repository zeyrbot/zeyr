import { container } from "@sapphire/pieces";
import { BaseParser, Context, type IParser } from "tagscript";

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
		const { image } = await container.image.eval(ctx.tag.payload!);

		if (!image) throw new Error("image returned nothing");

		ctx.response.actions.files = [image as unknown as string];

		return "";
	}
}
