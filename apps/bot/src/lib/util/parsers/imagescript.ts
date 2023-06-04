import { container } from "@sapphire/pieces";
import { Result } from "@sapphire/result";
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
		const result = await Result.fromAsync(
			async () => await container.utilities.image.eval(ctx.tag.payload!)
		);

		if (result.isErr()) {
			// rome-ignore lint/suspicious/noExplicitAny: GOD FORGIVE ME FOR WHAT I AM ABAOUT TO DO.
			const error = result.unwrapErr() as any;
			throw new Error(error.message ? error.message : error);
		}

		const { image, logs } = result.unwrap();

		if (!(image instanceof Buffer))
			throw new Error(
				"unexpected result, please double check that you returned the encoded image!"
			);

		ctx.response.actions.files = [image];

		return logs ?? "";
	}
}
