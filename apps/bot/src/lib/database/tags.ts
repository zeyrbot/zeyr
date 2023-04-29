import { container } from "@sapphire/framework";

export async function getTag(name: string, guildId: string) {
	return container.prisma.tag.findFirstOrThrow({
		where: {
			name,
			guildId,
		},
	});
}

export async function addTag(
	name: string,
	content: string,
	guildId: string,
	memberId: string,
) {
	return container.prisma.tag.create({
		data: {
			name,
			content,
			guild: {
				connectOrCreate: {
					where: {
						id: guildId!,
					},
					create: {
						id: guildId!,
					},
				},
			},
			author: {
				connectOrCreate: {
					where: {
						id: memberId,
					},
					create: {
						id: memberId,
						guildId: guildId!,
					},
				},
			},
		},
	});
}
