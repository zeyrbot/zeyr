import { format } from "./misc";
import { cast } from "@sapphire/utilities";
import type { Attachment, GuildTextBasedChannel } from "discord.js";

export async function getLastAttachment(
	channel: GuildTextBasedChannel,
	limit = 30
) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		({ attachments, embeds }) => attachments.size > 0 || embeds[0]?.data.url
	);

	if (!lastMessage) return undefined;

	const attachment =
		lastMessage.attachments.first() ||
		(lastMessage.embeds[0]?.data as Attachment);

	return {
		...attachment,
		mediaUrl: attachment.proxyURL ?? attachment.url
	};
}

export function ok(text: string, ...content: readonly unknown[]) {
	return format(`✅ ${text}`, cast<string>(content));
}

export function err(text: string, ...content: readonly unknown[]) {
	return format(`❌ ${text}`, cast<string>(content));
}

export function danger(text: string, ...content: readonly unknown[]) {
	return format(`⚠ ${text}`, cast<string>(content));
}

export function info(text: string, ...content: readonly unknown[]) {
	return format(`:information_source: ${text}`, cast<string>(content));
}
