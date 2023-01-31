import config from '@utils/config';
import { Middleware } from '@utils/middleware';
import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';

const requiresModerator: Middleware = {
	async execute(interaction: CommandInteraction, next: (params: unknown) => Promise<void>) {
		const member = interaction.member;
		if (!member) return;

		const roles = member.roles as GuildMemberRoleManager;
		if (!roles.cache.has(config.moderatorRole)) {
			interaction.reply({ ephemeral: true, content: 'You do not have enough permissions to use this command!' });
			return;
		}

		await next(interaction);
	}
};

export default requiresModerator;