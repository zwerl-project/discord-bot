import prisma from '@utils/prisma';
import { Message } from 'discord.js';

export const createOrUpdateMessage = (message: Message) => {
	return prisma.guildMessage.upsert({
		where: {
			messageId: message.id
		},
		update: {
			content: message.content
		},
		create: {
			messageId: message.id,
			authorId: message.author.id,
			channelId: message.channelId,
			guildId: message.guildId ?? 'null',
			content: message.content,
		}
	});
};

export const updateDeletedMessage = (message: Message) => {
	return prisma.guildMessage.upsert({
		where: {
			messageId: message.id
		},
		update: {
			deleted: true
		},
		create: {
			messageId: message.id,
			authorId: message.author.id,
			channelId: message.channelId,
			guildId: message.guildId ?? 'null',
			content: message.content,
			deleted: true
		}
	});
};

export const getMessage = (id: string) => {
	return prisma.guildMessage.findUnique({
		where: {
			messageId: id
		}
	});
};