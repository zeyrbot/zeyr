import type { Command } from "@kaname-png/plugin-subcommands-advanced";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";
import { cast } from "@sapphire/utilities";
import { AttachmentBuilder } from "discord.js";
import { Image, decode } from "imagescript";
import sharp from "sharp";
import { getLastAttachment } from "../lib/util";

@ApplyOptions<Utility.Options>({
	name: "image"
})
export class ImageUtility extends Utility {
	public async decode(buffer: BufferLike) {
		return cast<Image>(decode(await sharp(buffer).png().toBuffer()));
	}

	public async getRaw(url: string) {
		return fetch(url).then((i) => i.arrayBuffer());
	}

	public async get(url: string) {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then(this.decode);
	}

	public async font(url: string) {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then((f) => new Uint8Array(f));
	}

	public async sharp(url: string) {
		return fetch(url)
			.then((i) => i.arrayBuffer())
			.then(sharp);
	}

	public async sharpFromBuffer(
		buffer: BufferLike,
		options?: sharp.SharpOptions
	) {
		return sharp(buffer, options);
	}

	public async getMedia(
		interaction: Command.ChatInputInteraction<"cached">,
		name?: string
	) {
		return (
			(await getLastAttachment(interaction.channel!)) ??
			interaction.options.getAttachment(name ?? "image")
		);
	}

	public async attachment(buffer: BufferLike, name?: string) {
		return new AttachmentBuilder(Buffer.from(buffer), {
			name
		});
	}
}

export type BufferLike =
	| Uint8Array
	| ArrayBuffer
	| Uint8ClampedArray
	| Int8Array
	| Uint16Array;
