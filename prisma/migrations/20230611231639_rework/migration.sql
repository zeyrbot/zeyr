/*
  Warnings:

  - You are about to drop the column `language` on the `guilds` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `special` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guilds" DROP COLUMN "language";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio",
DROP COLUMN "special";
