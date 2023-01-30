import { randomBytes } from 'crypto';
import { EmbedBuilder, Events, Message, TextBasedChannel } from 'discord.js';
import { Event } from '@utils/events';
import config from '@utils/config';
import logger from '@utils/logger';
import prisma from '@utils/prisma';

const messageEditEvent: Event = {
	name: Events.MessageUpdate,
	once: false,
	async execute(_: Message<true>, message: Message<true>) {
		if (message.author.bot) return;
        
		const logsChannel = message.guild.channels.cache.get(config.logsChannel);

		if (!logsChannel) {
			logger.warn(`Could not log message with id: ${message.id} because the logs channel was not found`);
			return;
		}

		const cachedMessage = await prisma.guildMessage.findUnique(
			{
				where: {
					messageId: message.id
				}
			}
		);

		const embed = new EmbedBuilder()
			.setTitle('Message Edited')
			.setColor(0x0099FF)
			.addFields([
				{ name: 'Content', value: message?.content || 'No content stored in database.' },
				{ name: 'Previous Content', value: cachedMessage?.content || 'No content stored in database.' },
				{ name: 'URL', value: message.url }
			])
			.addFields([
				{ name: 'Author Mention', value: `<@${message.author.id}>`, inline: true },
				{ name: 'Author ID/Tag', value: `\`${message.author.id}\` /\n\`${message.author.tag}\``, inline: true},
				{ name: 'Channel', value: `<#${message.channelId}>`, inline: true },
			])
			.addFields({
				name: 'Attachments',
				value: message.attachments.size > 0 ? message.attachments.map((attachment, index) => `\`${index + 1}\` - ${attachment.name}`).join('\n') : 'No attachments',
			})
			.addFields({
				name: 'Embeds',
				value: message.embeds.length > 0 ? message.embeds.map((embed, index) => `\`${index + 1}\` - ${embed.title || 'No title'}`).join('\n') : 'No embeds',
			})
			.addFields({ name: 'Log ID', value: `This field is used for adding notes to this log message.\n${randomBytes(15).toString('hex')}`, inline: false })
			.setFooter({ text: `${message.id} • ${new Date(message.createdTimestamp).toLocaleString()}` });
        
		await (logsChannel as TextBasedChannel).send({ embeds: [embed] });
        
		if (!cachedMessage) return;
        
		await prisma.guildMessage.update({
			where: {
				id: cachedMessage.id
			},
			data: {
				content: message.content
			}
		});
	}
};

export default messageEditEvent;