import { fetch, FetchMethods, FetchResultTypes } from "@sapphire/fetch";
import { APIS } from "./enums";
import {
	type List,
	type DlistOptions,
	type ValorantAccount,
	type ValorantResult,
	type ValorantRegions,
	type ValorantMMR,
	type ImagescriptOutput,
	ImagescriptFormat,
} from "../types/apis";
import { decodeWEBP } from "./performance";
import Imagescript, { Frame, GIF, Image } from "imagescript";
import { runInNewContext } from "vm";
import SimplexNoise from "simplex-noise";
import { inspect } from "util";
import { isThenable } from "@sapphire/utilities";

/**
 * A wrapper for easier image manipulation
 * @author ruunao
 */
export class ImageManipulation {
	constructor() {}

	public async decode(url: string): Promise<Image> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);
		const result = (await decodeWEBP(buffer)) as Image;

		return result;
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

		const result: Image | GIF | undefined = await runInNewContext(
			script,
			{
				Imagescript,
				Image,
				Frame,
				GIF,
				SimplexNoise,
				_inspect: inspect,
				console: _console,
				...inject,
			},
			{ timeout: 60000 },
		);

		if (isThenable(result)) await result;
		if (!(result instanceof Image) && result !== undefined)
			throw new Error("`image` is not a valid Image");

		const output: ImagescriptOutput = {
			image: undefined,
			format: result
				? result instanceof Image
					? ImagescriptFormat.PNG
					: ImagescriptFormat.GIF
				: undefined,
		};

		if (result) {
			const buffer = await result.encode();

			output.image = Buffer.from(buffer);
		}

		return output;
	}
}

/**
 * A wrapper for the Unofficial valorant api
 * @author ruunao
 */
export class Valorant {
	baseUrl: string;
	constructor() {
		this.baseUrl = APIS.VALORANT;
	}

	public async account(name: string, tag: string) {
		return fetch<ValorantResult<ValorantAccount>>(
			`${this.baseUrl}/v1/account/${name}/${tag}`,
			FetchResultTypes.JSON,
		);
	}

	public async mmr(region: ValorantRegions, name: string, tag: string) {
		return fetch<ValorantResult<ValorantMMR>>(
			`${this.baseUrl}/v2/mmr/${region}/${name}/${tag}`,
			FetchResultTypes.JSON,
		);
	}
}

/**
 * A wrapper for the urbandictionary api
 * @author ruunao
 */
export class Urbandictionary {
	baseUrl: string;
	constructor() {
		this.baseUrl = APIS.URBANDICTIONARY;
	}

	public async autocomplete(term: string) {
		return fetch<string[]>(
			`${this.baseUrl}/autocomplete?term=${term}`,
			FetchResultTypes.JSON,
		);
	}

	public async define(term: string) {
		return fetch<List>(
			`${this.baseUrl}/define?term=${term}`,
			FetchResultTypes.JSON,
		);
	}
}

/**
 * A wrapper for the discordlist.gg api
 * @author ruunao
 */
export class Dlist {
	options: DlistOptions;
	url: string;
	constructor(options: DlistOptions) {
		this.options = options;
		this.url = APIS.DLIST;
	}

	public async postGuildCount(count: number) {
		return await fetch<boolean>(
			`${this.url}/bots/${this.options.id}/stats`,
			{
				method: FetchMethods.Post,
				headers: {
					Authorization: this.parseBodyToken(),
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify({
					server_count: count,
				}),
			},
			FetchResultTypes.JSON,
		);
	}

	private parseBodyToken() {
		return `Bearer ${this.options.token}`;
	}
}
