import { EmbedBuilder } from '@discordjs/builders';
import { Presence, User } from 'discord.js';

export const createBeanEmbed = async (source: User, target: User, reason: string) => {
	return new EmbedBuilder()
		.setTitle('User Beaned')
		.setColor(0x0099FF)
		.setThumbnail(target.avatarURL())
		.setDescription(`Beaned <@${target.id}>`)
		.addFields(
			{ name: 'Reason', value: reason },
			{ name: '"Responsible" "Moderator"', value: `<@${source}>` }
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