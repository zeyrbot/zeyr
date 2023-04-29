/*
  Warnings:

  - You are about to drop the column `guildId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `tags` table. All the data in the column will be lost.
  - Added the required column `guild_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_guildId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_memberId_fkey";

-- DropIndex
DROP INDEX "tags_guildId_idx";

-- DropIndex
DROP INDEX "tags_memberId_idx";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "guildId",
DROP COLUMN "userId",
ADD COLUMN     "guild_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "guildId",
DROP COLUMN "memberId",
ADD COLUMN     "guild_id" TEXT NOT NULL,
ADD COLUMN     "member_id" TEXT NOT NULL,
ALTER COLUMN "uses" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
