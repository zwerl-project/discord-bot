import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { GuildService } from '@services';
import { Middleware } from '@interfaces';
import logger from '@utils/logger';

const requiresModerator: Middleware = {
	async execute(interaction: CommandInteraction, next: (params: unknown) => Promise<void>) {
		const { member, guild } = interaction;
		if (!member || !guild) return;

		const roles = member.roles as GuildMemberRoleManager;
		
		const moderatorRole = await GuildService.getModerationRole(guild);
		if (!moderatorRole) throw new Error('Guild is not registered or moderator role not set!');

		if (!roles.cache.has(moderatorRole.id)) {
			logger.warn(`User ${member.user.username} (${member.user.id}) tried to use a moderator command in ${guild.name}!`);
			interaction.reply({ ephemeral: true, content: 'You do not have enough permissions to use this command!' });
			return;
		}

		await next(interaction);
	}
};

export default requiresModerator;