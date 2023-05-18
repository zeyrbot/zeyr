import type { Attachment, GuildTextBasedChannel, Message } from "discord.js";
import { decode } from "imagescript";
import sharp from "sharp";

export function optimiseGithubCDN(url: string) {
	const optimisedUrl = new URL(
		url.replace("raw.githubusercontent.com", "rawcdn.githack.com"),
	);
	optimisedUrl.searchParams.append("min", "1");

	return optimisedUrl.toString();
}

export function generateOptimisedName(format: string) {
	return `${(Math.random() + 1).toString(36).substring(2)}.${format}`;
}

export async function secureFetch(url: string, init?: RequestInit) {
	const controller = new AbortController();
	const id = setTimeout(() => {
		controller.abort();
	}, 10000);

	const response = await fetch(url, {
		...init,
		signal: controller.signal,
	});

	clearTimeout(id);
	return response;
}

export async function decodeWEBP(input: Buffer) {
	return decode(await sharp(input).png().toBuffer());
}

export async function lastMedia(channel: GuildTextBasedChannel, limit = 30) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		(message: Message) =>
			message.attachments.size > 0 || message.embeds[0]?.data.url,
	);

	if (!lastMessage) return undefined;

	const attachment =
		lastMessage.attachments.first() ||
		(lastMessage.embeds[0].data as Attachment);

	return attachment;
}
