import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, Message, Presence, User } from 'discord.js';
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

export const createBuilderApplicationEmbed = async (user: GuildMember, status: 'pending' | 'closed' | 'approved' | 'denied') => {
	return new EmbedBuilder()
		.setAuthor({ name: user.user.tag, iconURL: user.user.avatarURL() as string })
		.setColor(0x0099FF)
		.addFields([
			{ 
				name: 'Information',
				value: 'You have created a new builder application for the Content Styled server.\n Please beware that we\'re a small team and the application process may take a while. Make sure that you answers to all the questions carefully, take your time.\n\n', 
				inline: false 
			},
			{
				name: 'Application Status',
				value: status,
				inline: true
			},
			{
				name: 'Reviewer',
				value: '<@221054071736369152>',
				inline: true
			},
			{
				name: 'Application ID',
				value: `Your application ID is \`${randomBytes(15).toString('hex')}\`. Please use this ID when contacting us about your application.`,
				inline: false
			},
		])
		.setFooter({ text: user.id });
};

export const createBuilderApplicationComponents = async () => {
	return new ActionRowBuilder<ButtonBuilder>()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('approve-application')
				.setLabel('Approve')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('deny-application')
				.setLabel('Deny')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('close-application')
				.setLabel('Close Application')
				.setStyle(ButtonStyle.Danger)
		);
};

export const createE621SearchEmbed = async (tags: string) => {
	return new EmbedBuilder()
		.setTitle('E621 Search')
		.setColor(0x0099FF)
		.addFields([
			{ value: 'Here are some posts found according to your search!', name: 'Information'},
			{ name: 'Searched Tags', value: tags, inline: true }
		]);
};