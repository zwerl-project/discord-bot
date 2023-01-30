import { Event } from '@utils/events';
import prisma from '@utils/prisma';
import { Events, Message } from 'discord.js';

const mesageCreateEvent: Event = {
	name: Events.MessageCreate,
	once: false,
	async execute(message: Message<true>) {
		if (message.author.bot) return;
		
		await prisma.guildMessage.create({
			data: {
				messageId: message.id,
				authorId: message.author.id,
				channelId: message.channelId,
				guildId: message.guildId,
				content: message.content,
			}
		});

        
	}
};

export default mesageCreateEvent;