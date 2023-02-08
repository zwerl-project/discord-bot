import { Message, Presence, User } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { GuildMessage } from '@prisma/client';
import { randomBytes } from 'crypto';

export const createBeanEmbed = async (source: User, target: User, reason: string) => {
	return new EmbedBuilder()
		.setTitle('User Beaned')
		.setColor(0x0099FF)
		.setThumbnail(target.avatarURL())
		.setDescription(`Beaned <@${target.id}>`)
		.addFields(
			{ name: 'Reason', value: reason },
			{ name: '"Responsible" "Moderator"', value: `<@${source.id}>` }
		);
};

export const createActivityEmbed = async (target: User, presence: Presence) => {
	return new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('User Activity')
		.setThumbnail(target?.avatarURL())
		.addFields(
			{ 
				name: 'Identification', 
				value: `Target user: <@${target?.id}>\nCurrent status: \`${presence.clientStatus?.desktop}\`` 
			},
		)
		.addFields(presence.activities.map(activity => {
			return { 
				name: activity.name || 'Unknown Activity',
				value: `${activity.state}: ${activity.details}` || 'This activity has no details'
			};
		}));	
};

export const createImageEmbed = async (imageUrl: string, title?: string, footer?: string) => {
	return new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(title || 'Image')
		.setImage(imageUrl)
		.setFooter({ text: footer ?? imageUrl });
};

export const createMessageUpdatedEmbed = async (message: Message, cachedMessage: GuildMessage | null) => {
	return new EmbedBuilder()
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
};

export const createMessageDeletedEmbed = async (message: Message) => {
	return new EmbedBuilder()
		.setTitle('Message Deleted')
		.setColor(0xff0000)
		.addFields([
			{ name: 'Content', value: message.content || 'No content' },
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
};