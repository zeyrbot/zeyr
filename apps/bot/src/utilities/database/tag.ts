import type { Prisma } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";

@ApplyOptions<Utility.Options>({
	name: "tag"
})
export class DatabaseTagUtility extends Utility {
	/**
	 * Updates an existing tag
	 * @param where Where data
	 * @param data Data
	 * @returns Tag
	 */
	public async update(
		where: Prisma.TagWhereUniqueInput,
		data: Prisma.TagUpdateInput
	) {
		return this.container.prisma.tag.update({
			where,
			data
		});
	}

	/**
	 * Gets a single tag
	 * @param name Name of the tag
	 * @param guildId ID of the guild
	 * @returns Tag
	 */
	public async get(name: string, guildId: string) {
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

	/**
	 * Gets many tags matching the criteria
	 * @param guildId ID of the guild
	 * @param memberId ID of the member
	 * @returns Tag[]
	 */
	public async getMany(guildId: string, memberId?: string) {
		return this.container.prisma.tag.findMany({
			where: {
				guildId,
				memberId
			}
		});
	}

	/**
	 * Increments a tag's usage
	 * @param id ID of the tag
	 * @returns Tag
	 */
	public async incrementUsage(id: number) {
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

	/**
	 * Deletes a tag
	 * @param name Name of the tag
	 * @param guildId ID of the guild
	 * @returns Tag
	 */
	public async delete(name: string, guildId: string) {
		return this.container.prisma.tag.delete({
			where: {
				name_guildId: {
					guildId,
					name
				}
			}
		});
	}

	/**
	 * Creates a new tag
	 * @param name Name of the tag
	 * @param content Content of the tag
	 * @param guildId ID of the guild
	 * @param memberId ID of the member
	 * @returns Tag
	 */
	public async create(
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
