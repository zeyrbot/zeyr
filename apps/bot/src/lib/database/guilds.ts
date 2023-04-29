import { Prisma } from "@prisma/client";
import { container } from "@sapphire/framework";

export async function updateGuild(
	where: Prisma.GuildWhereUniqueInput,
	data: Prisma.GuildUpdateInput,
) {
	await container.prisma.guild.update({
		where,
		data,
	});
}

export async function getOrCreateGuild(id: string) {
	const guild = await container.prisma.guild.findUnique({
		where: {
			id,
		},
	});

	if (!guild) {
		await container.prisma.guild.create({
			data: {
				id,
			},
		});

		return undefined;
	}

	return guild;
}

export async function createGuild(id: string) {
	await container.prisma.guild
		.create({
			data: {
				id,
			},
		})
		.catch(() => false);

	return true;
}

export async function removeGuild(id: string) {
	await container.prisma.guild
		.delete({
			where: {
				id,
			},
		})
		.catch(() => false);

	return true;
}
