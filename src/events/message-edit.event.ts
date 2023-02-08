import { Events, Message, TextBasedChannel } from 'discord.js';
import { EmbedService, GuildService, LoggingService } from '@services';
import { Event } from '@interfaces';
import logger from '@utils/logger';

const messageEditEvent: Event = {
	name: 'logging-message-edit',
	on: Events.MessageUpdate,
	once: false,
	async execute(_: Message<true>, message: Message<true>) {
		if (message.author.bot) return;
		
		const cachedMessage = await LoggingService.getMessage(message.id);
		await LoggingService.createOrUpdateMessage(message);
		
		const logsChannel = await GuildService.getLogsChannel(message.guild);
		
		if (!logsChannel) {
			logger.warn(`Could not log message with id: ${message.id} because the logs channel was not found`);
			return;
		}
		
		const embed = await EmbedService.createMessageUpdatedEmbed(message, cachedMessage);
		await (logsChannel as TextBasedChannel).send({ embeds: [embed] });
	}
};

export default messageEditEvent;