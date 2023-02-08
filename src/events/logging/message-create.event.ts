import { Event } from '@interfaces';
import { Events, Message } from 'discord.js';
import { LoggingService } from '@services';

const mesageCreateEvent: Event = {
	name: 'logging-message-create',
	on: Events.MessageCreate,
	once: false,
	async execute(message: Message<true>) {
		if (message.author.bot) return;
		await LoggingService.createOrUpdateMessage(message);
	}
};

export default mesageCreateEvent;