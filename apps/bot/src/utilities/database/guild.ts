import type { Prisma } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Utility } from "@sapphire/plugin-utilities-store";

@ApplyOptions<Utility.Options>({
	name: "guild"
})
export class DatabaseGuildUtility extends Utility {
	/**
	 * Updates an existing guild
	 * @param where Where data
	 * @param data Data
	 * @returns Guild
	 */
	public async update(
		where: Prisma.GuildWhereUniqueInput,
		data: Prisma.GuildUpdateInput
	) {
		return this.container.prisma.guild.update({
			where,
			data
		});
	}

	/**
	 * Tries to fetch a guild, if no guild is returned, creates a new one
	 * @param id ID of the guild
	 * @returns Guild
	 */
	public async getOrCreate(id: string) {
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

	/**
	 * Creates a guild and returns it
	 * @param id ID of the guild
	 * @returns Guild
	 */
	public async create(id: string) {
		return this.container.prisma.guild.create({
			data: {
				id
			}
		});
	}

	/**
	 * Deletes a guild and returns it
	 * @param id ID of the guild
	 * @returns Guild
	 */
	public async delete(id: string) {
		return await this.container.prisma.guild.delete({
			where: {
				id
			}
		});
	}
}
