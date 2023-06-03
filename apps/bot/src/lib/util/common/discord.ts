import type { Attachment, GuildTextBasedChannel, Message } from "discord.js";

export async function lastMedia(channel: GuildTextBasedChannel, limit = 30) {
	const messages = await channel.messages.fetch({ limit });

	const lastMessage = messages.find(
		(message: Message) =>
			message.attachments.size > 0 || message.embeds[0]?.data.url
	);

	if (!lastMessage) return undefined;

	const attachment =
		lastMessage.attachments.first() ||
		(lastMessage.embeds[0].data as Attachment);

	return {
		...attachment,
		mediaUrl: attachment.proxyURL ?? attachment.url
	};
}
