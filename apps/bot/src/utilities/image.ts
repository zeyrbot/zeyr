import {
	ImagescriptFormat,
	type ImagescriptOutput
} from "../lib/types/imagescript";
import { secureFetch } from "../lib/util/common/misc";
import { ApplyOptions } from "@sapphire/decorators";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { Utility } from "@sapphire/plugin-utilities-store";
import { Result } from "@sapphire/result";
import { cast } from "@sapphire/utilities";
import Imagescript, { Frame, GIF, Image, decode } from "imagescript";
import sharp from "sharp";
import { inspect as _inspect } from "util";
import { runInNewContext } from "vm";

@ApplyOptions<Utility.Options>({
	name: "image"
})
export class ImageUtility extends Utility {
	public async decodeWEBP(input: Buffer) {
		const image = sharp(input);
		const { format } = await image.metadata();

		return format === "webp"
			? decode(await image.png().toBuffer())
			: decode(await image.toBuffer());
	}

	public async sharp(url: string): Promise<sharp.Sharp> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);
		const data = sharp(buffer);

		return data;
	}

	public async fetch(url: string): Promise<Buffer> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);

		return buffer;
	}

	public async decode(url: string): Promise<Image | Frame> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);
		const result = await this.decodeWEBP(buffer);

		return result instanceof GIF ? (result[0] as Frame) : result;
	}

	public async font(url: string): Promise<Uint8Array> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);
		const result = new Uint8Array(buffer);

		return result;
	}

	public async eval(code: string, inject?: Record<string, unknown>) {
		const script = `
		(async () => {
			${code}
			const __typeofImage = typeof image;
			if (__typeofImage === "undefined") {
				return undefined;
			} else {
				return image;
			}
		})();
	`;

		const logs: string[] = [];
		const virtualConsole = {
			log: (a: string) => logs.push(a)
		};

		const imagescript = await Result.fromAsync(
			async () =>
				await runInNewContext(
					script,
					{
						Imagescript,
						Image,
						Frame,
						GIF,
						decode,
						inspect: _inspect,
						console: virtualConsole,
						fetch: secureFetch,
						process: "no",
						...inject
					},
					{ timeout: 60_000, filename: "imagescript" }
				)
		);

		let result: Uint8Array | ArrayBuffer | undefined = imagescript.unwrapOrElse(
			(e) => {
				throw new Error(cast<Error>(e).message);
			}
		);

		if (result === undefined) throw new Error("Code returned no response");
		if (result instanceof ArrayBuffer) result = new Uint8Array(result);
		if (!(result instanceof Uint8Array))
			throw new Error("Code returned invalid response");

		const output: ImagescriptOutput = {
			image: undefined,
			format:
				result instanceof GIF ? ImagescriptFormat.GIF : ImagescriptFormat.PNG
		};

		if (result) {
			output.image = Buffer.from(result);
		}

		return {
			...output,
			logs: logs.join("\n")
		};
	}
}
