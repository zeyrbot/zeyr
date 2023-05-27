import { container } from "@sapphire/framework";

export async function getTag(name: string, guildId: string) {
	return container.prisma.tag.findFirst({
		where: {
			name,
			guildId,
		},
		include: {
			author: true,
		},
	});
}

export async function getTagsList(guildId: string, memberId?: string) {
	return container.prisma.tag.findMany({
		where: {
			guildId,
			memberId,
		},
	});
}

export async function incrementTagUsage(id: number) {
	return container.prisma.tag.update({
		where: {
			id,
		},
		data: {
			uses: {
				increment: 1,
			},
		},
	});
}

export async function deleteTag(name: string, guildId: string) {
	return container.prisma.tag.delete({
		where: {
			name_guildId: {
				guildId,
				name,
			},
		},
	});
}

export async function addTag(
	name: string,
	content: string,
	guildId: string,
	memberId: string,
) {
	return container.prisma.member.upsert({
		where: {
			id: memberId,
		},
		update: {
			tags: {
				create: {
					name,
					content,
					guildId,
				},
			},
		},
		create: {
			id: memberId,
			tags: {
				create: {
					name,
					content,
					guildId,
				},
			},
			guild: {
				connectOrCreate: {
					where: {
						id: guildId,
					},
					create: {
						id: guildId,
					},
				},
			},
		},
	});
}
