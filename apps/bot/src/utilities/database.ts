import type { Prisma } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";

@ApplyOptions<Utility.Options>({
	name: "database"
})
export class DatabaseUtility extends Utility {
	// guilds manager
	public async guildUpdate(
		where: Prisma.GuildWhereUniqueInput,
		data: Prisma.GuildUpdateInput
	) {
		await this.container.prisma.guild.update({
			where,
			data
		});
	}

	public async guildGetOrCreate(id: string) {
		const guild = await this.container.prisma.guild.findUnique({
			where: {
				id
			}
		});

		if (!guild) {
			await this.container.prisma.guild.create({
				data: {
					id
				}
			});

			return undefined;
		}

		return guild;
	}

	public async guildCreate(id: string) {
		return await this.container.prisma.guild.create({
			data: {
				id
			}
		});
	}

	public async guildDelete(id: string) {
		await this.container.prisma.guild.delete({
			where: {
				id
			}
		});
	}

	// tags manager
	public async tagGet(name: string, guildId: string) {
		return this.container.prisma.tag.findFirst({
			where: {
				name,
				guildId
			},
			include: {
				author: true
			}
		});
	}

	public async tagsGet(guildId: string, memberId?: string) {
		return this.container.prisma.tag.findMany({
			where: {
				guildId,
				memberId
			}
		});
	}

	public async tagUsageIncrement(id: number) {
		return this.container.prisma.tag.update({
			where: {
				id
			},
			data: {
				uses: {
					increment: 1
				}
			}
		});
	}

	public async tagDelete(name: string, guildId: string) {
		return this.container.prisma.tag.delete({
			where: {
				name_guildId: {
					guildId,
					name
				}
			}
		});
	}

	public async tagCreate(
		name: string,
		content: string,
		guildId: string,
		memberId: string
	) {
		return this.container.prisma.member.upsert({
			where: {
				id: memberId
			},
			update: {
				tags: {
					create: {
						name,
						content,
						guildId
					}
				}
			},
			create: {
				id: memberId,
				tags: {
					create: {
						name,
						content,
						guildId
					}
				},
				guild: {
					connectOrCreate: {
						where: {
							id: guildId
						},
						create: {
							id: guildId
						}
					}
				}
			}
		});
	}
}
