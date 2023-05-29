import {
	ImagescriptFormat,
	type ImagescriptOutput,
} from "../lib/types/imagescript";
import { minutes } from "../lib/util";
import { secureFetch } from "../lib/util/common/misc";
import { ApplyOptions } from "@sapphire/decorators";
import { FetchResultTypes, fetch } from "@sapphire/fetch";
import { UserError } from "@sapphire/framework";
import { Utility } from "@sapphire/plugin-utilities-store";
import { cast } from "@sapphire/utilities";
import Imagescript, { Frame, GIF, Image, decode } from "imagescript";
import sharp from "sharp";
import SimplexNoise from "simplex-noise";
import { inspect } from "util";
import { runInNewContext } from "vm";

@ApplyOptions<Utility.Options>({
	name: "image",
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

	public async eval(
		code: string,
		inject?: Record<string, unknown>,
	): Promise<ImagescriptOutput> {
		const script = `(async() => {
			${code}
			const __typeofImage = typeof(image);
			if(__typeofImage === 'undefined') {
				return undefined;
			} else {
				return image;
			}
		})()`;
		const _console = {
			log: (arg: string) => `${arg}\n`,
		};

		let result: Uint8Array | undefined;

		try {
			result = await runInNewContext(
				script,
				{
					Imagescript,
					Image,
					Frame,
					GIF,
					decode,
					SimplexNoise,
					_inspect: inspect,
					console: _console,
					fetch: secureFetch,
					process: "no",
					...inject,
				},
				{ timeout: minutes(1) },
			);
		} catch (e) {
			throw new UserError({
				message: cast<Error>(e).message,
				identifier: "ImagescriptError",
			});
		}

		if (result === undefined)
			throw new UserError({
				message: "Code returned no response",
				identifier: "ImagescriptNoResponse",
			});
		if (!(result instanceof Uint8Array))
			throw new UserError({
				message: "Code returned invalid response",
				identifier: "ImagescriptInvalidResponse",
			});

		if (result instanceof ArrayBuffer) result = new Uint8Array(result);

		const output: ImagescriptOutput = {
			image: undefined,
			format: result
				? result instanceof Image
					? ImagescriptFormat.PNG
					: ImagescriptFormat.GIF
				: undefined,
		};

		if (result) {
			output.image = Buffer.from(result);
		}

		return output;
	}
}
