import { ImagescriptFormat, type ImagescriptOutput } from "../types/apis/extra";
import type {
	ApexPlatforms,
	ApexProfile,
	CSGOPlatforms,
	TrackerRoot,
} from "../types/apis/tracker";
import type { UrbanList } from "../types/apis/urban";
import type {
	ValorantAccount,
	ValorantMMR,
	ValorantRegions,
	ValorantRoot,
} from "../types/apis/valorant";
import { APIS } from "./enums";
import { decodeWEBP, secureFetch } from "./performance";
import { FetchMethods, FetchResultTypes, fetch } from "@sapphire/fetch";
import { UserError } from "@sapphire/framework";
import { cast } from "@sapphire/utilities";
import Imagescript, { Frame, GIF, Image, decode } from "imagescript";
import SimplexNoise from "simplex-noise";
import { inspect } from "util";
import { runInNewContext } from "vm";

/**
 * A wrapper for tracker.gg public api
 * @author ruunao
 */
export class TrackerGG {
	baseUrl: string;
	private readonly key: string;
	constructor(key: string) {
		this.baseUrl = APIS.TRACKERGG;
		this.key = key;
	}

	public async apexProfile(platform: ApexPlatforms, id: string) {
		return fetch<TrackerRoot<ApexProfile>>(
			`${this.baseUrl}/apex/standard/profile/${platform}/${id}`,
			{
				headers: {
					"TRN-Api-Key": this.key!,
					"Content-Type": "application/json",
				},
			},
			FetchResultTypes.JSON,
		);
	}

	public async csgoProfile(platform: CSGOPlatforms, id: string) {
		return fetch<TrackerRoot<ApexProfile>>(
			//WIPPPPPPPPPPPPPppp
			`${this.baseUrl}/csgo/standard/profile/${platform}/${id}`,
			{
				headers: {
					"TRN-Api-Key": this.key!,
					"Content-Type": "application/json",
				},
			},
			FetchResultTypes.JSON,
		);
	}
}

/**
 * A wrapper for easier image manipulation
 * @author ruunao
 */
export class ImageManipulation {
	constructor() {}

	public async sharp(url: string): Promise<Buffer> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);

		return buffer;
	}

	public async decode(url: string): Promise<Image> {
		const buffer = await fetch(url, FetchResultTypes.Buffer);
		const result = cast<Image>(await decodeWEBP(buffer));

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
				{ timeout: 60000 },
			);
		} catch {
			throw new UserError({
				message: "An error occurred",
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

/**
 * A wrapper for the Unofficial valorant api
 * @author ruunao
 */
export class Valorant {
	baseUrl: string;
	key?: string;
	constructor(key?: string) {
		this.baseUrl = APIS.VALORANT;
		this.key = key;
	}

	public async account(name: string, tag: string) {
		return fetch<ValorantRoot<ValorantAccount>>(
			`${this.baseUrl}/v1/account/${name}/${tag}`,
			{
				headers: this.headers,
			},
			FetchResultTypes.JSON,
		);
	}

	public async mmr(region: ValorantRegions, name: string, tag: string) {
		return fetch<ValorantRoot<ValorantMMR>>(
			`${this.baseUrl}/v2/mmr/${region}/${name}/${tag}`,
			{
				headers: this.headers,
			},
			FetchResultTypes.JSON,
		);
	}

	public async crosshair(code: string) {
		return fetch(
			`${this.baseUrl}/v1/crosshair/generate?id=${code}`,
			{
				headers: this.headers,
			},
			FetchResultTypes.Buffer,
		);
	}

	private headers = {
		Authorization: this.key ?? "",
	};
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
		return fetch<UrbanList>(
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
	id: string;
	key?: string;
	baseUrl: string;
	constructor(id: string, key: string) {
		this.id = id;
		this.key = key;
		this.baseUrl = APIS.DLIST;
	}

	public async postGuildCount(count: number) {
		return await fetch<boolean>(
			`${this.baseUrl}/bots/${this.id}/stats`,
			{
				method: FetchMethods.Post,
				headers: this.headers,
				body: JSON.stringify({
					server_count: count,
				}),
			},
			FetchResultTypes.JSON,
		);
	}

	private headers = {
		Authorization: `Bearer ${this.key}`,
		"Content-Type": "application/json; charset=utf-8",
	};
}
