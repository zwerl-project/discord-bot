import { Events, Message, TextBasedChannel } from 'discord.js';
import { EmbedService, LoggingService, GuildService } from '@services';
import { Event } from '@interfaces';
import logger from '@utils/logger';

const messageDeleteEvent: Event = {
	name: 'logging-message-delete',
	on: Events.MessageDelete,
	once: false,
	async execute(message: Message<true>) {
		if (message.author.bot) return;
		
		await LoggingService.updateDeletedMessage(message);
		
		const logsChannel = await GuildService.getLogsChannel(message.guild);

		if (!logsChannel) {
			logger.warn(`Could not log message with id: ${message.id} because the logs channel was not found`);
			return;
		}

		const embed = await EmbedService.createMessageDeletedEmbed(message);
		await (logsChannel as TextBasedChannel).send({ embeds: [embed] });
	}
};

export default messageDeleteEvent;