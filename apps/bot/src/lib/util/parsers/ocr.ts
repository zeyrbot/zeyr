import { BaseParser, Context, type IParser } from "tagscript";

/**
 * Scans an image for text (TODO)
 *
 * Aliases: ocr, img2text
 *
 * @example
 * ```yaml
 * {ocr:URL}
 * ```
 */
export class OCRParser extends BaseParser implements IParser {
	public constructor() {
		super(["ocr", "img2text"], false, true);
	}

	public parse(ctx: Context) {
		return ctx.tag.payload;
	}
}
