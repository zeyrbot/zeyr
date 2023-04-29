/*
  Warnings:

  - A unique constraint covering the columns `[name,guild_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tags_name_guild_id_key" ON "tags"("name", "guild_id");
