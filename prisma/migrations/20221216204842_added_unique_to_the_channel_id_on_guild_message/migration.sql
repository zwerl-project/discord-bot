/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `guild_messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guild_messages_messageId_key" ON "guild_messages"("messageId");
