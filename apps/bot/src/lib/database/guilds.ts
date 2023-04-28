import { Prisma } from "@prisma/client";
import { container } from "@sapphire/framework";

export async function update(
  where: Prisma.GuildWhereUniqueInput,
  data: Prisma.GuildUpdateInput
) {
  await container.prisma.guild.update({
    where,
    data,
  });
}

export async function getOrCreate(id: string) {
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

export async function create(id: string) {
  await container.prisma.guild
    .create({
      data: {
        id,
      },
    })
    .catch(() => false);

  return true;
}

export async function remove(id: string) {
  await container.prisma.guild
    .delete({
      where: {
        id,
      },
    })
    .catch(() => false);

  return true;
}
