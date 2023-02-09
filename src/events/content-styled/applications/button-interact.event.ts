import {  EmbedFooterData, Events, GuildMember, GuildMemberRoleManager, MessageComponentInteraction, ThreadChannel } from 'discord.js';
import { EmbedService, GuildService } from '@services';
import { Event } from '@interfaces';
import logger from '@utils/logger';

interface ApplicationUpdateEvent extends Event {
	approveApplication: (interaction: MessageComponentInteraction, isModerator: boolean) => Promise<void>;
	denyApplication: (interaction: MessageComponentInteraction, isModerator: boolean) => Promise<void>;
	closeApplication: (interaction: MessageComponentInteraction, isModerator: boolean) => Promise<void>;
}

const OnApplicationUpdate: ApplicationUpdateEvent = {
	name: 'contentstyled-application-button-interact',
	on: Events.InteractionCreate,
	once: false,
	
	async execute(interaction: MessageComponentInteraction) {
		if (!interaction.isButton()) return;
		await interaction.deferReply({ ephemeral: true });
	
		const { member, guild } = interaction;
		if (!member || !guild) return;

		const moderatorRole = await GuildService.getModerationRole(guild);
		if (!moderatorRole) throw new Error('Moderation role not found!');

		const roles = member.roles as GuildMemberRoleManager;

		const isModerator = roles.cache.has(moderatorRole.id);

		try {
			switch (interaction.customId) {
			case 'approve-application':
				await this.approveApplication(interaction, isModerator);
				break;
			case 'deny-application':
				await this.denyApplication(interaction, isModerator);
				break;
			case 'close-application':
				await this.closeApplication(interaction, isModerator);
				break;
			}
		} catch (error) {
			logger.error(error);
			await interaction.editReply({ content: 'An error occured while processing your request.' });
		}
	},

	async approveApplication(interaction: MessageComponentInteraction, isModerator: boolean) {
		const { member, message, channel } = interaction;
		const thread = channel as ThreadChannel;

		if (!isModerator) {
			await interaction.editReply({ content: 'You are not allowed to approve applications!' });
			return;
		}

		const embed = await EmbedService.createBuilderApplicationEmbed(member as GuildMember, 'approved');
		await message.edit( { embeds: [embed], components: [] });
		
		await thread.send({ content: 'This thread has been closed.' });
		await interaction.editReply({ content: 'Application approved!' });
		
		await thread.setLocked(true);
		await thread.setArchived(true);
	},
	
	async denyApplication(interaction: MessageComponentInteraction, isModerator: boolean) {
		const { member, message, channel } = interaction;
		const thread = channel as ThreadChannel;

		if (!isModerator) {
			await interaction.editReply({ content: 'You are not allowed to deny applications!' });
			return;
		}
		
		const embed = await EmbedService.createBuilderApplicationEmbed(member as GuildMember, 'denied');
		await message.edit( { embeds: [embed], components: [] });

		await thread.send({ content: 'This thread has been closed.' });
		await interaction.editReply({ content: 'Application denied!' });

		await thread.setLocked(true);
		await thread.setArchived(true);

	},
	
	async closeApplication(interaction: MessageComponentInteraction, isModerator: boolean) {
		const { member, message, channel } = interaction;
		const thread = channel as ThreadChannel;

		const user = member?.user;
		if (!user) throw new Error('Member not found!');

		const author = message.embeds[0].footer as EmbedFooterData;
		const isAuthor = user.id === author.text;

		if (!isModerator && !isAuthor) {
			await interaction.editReply({ content: 'You are not allowed to close applications!' });
			return;
		}
		
		const embed = await EmbedService.createBuilderApplicationEmbed(member as GuildMember, 'closed');
		await message.edit( { embeds: [embed], components: [] });

		await thread.send({ content: 'This thread has been closed.' });
		await interaction.editReply({ content: 'Application closed!' });

		await thread.setLocked(true);
		await thread.setArchived(true);
	}
};

export default OnApplicationUpdate;