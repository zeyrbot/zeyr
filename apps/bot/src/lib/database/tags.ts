import { container } from "@sapphire/framework";

export async function getTag(name: string, guildId: string) {
	return container.prisma.tag.findFirst({
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
	return container.prisma.guild.upsert({
		where: {
			id: guildId,
		},
		update: {
			members: {
				connectOrCreate: {
					where: {
						id: memberId,
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
					},
				},
			},
		},
		create: {
			id: guildId,
			members: {
				create: {
					id: memberId,
					tags: {
						create: {
							name,
							content,
							guildId,
						},
					},
				},
			},
		},
	});
}
