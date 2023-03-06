import { Events, GuildMember } from 'discord.js';
import { Event } from '@interfaces';
import { UserService, GuildService } from '@services';
import logger from '@utils/logger';

const userJoinEvent: Event = {
	name: 'whitelist-user-join',
	on: Events.GuildMemberAdd,
	once: false,
	async execute(member: GuildMember) {
		if (member.user.bot) return; // if it is a bot ignore it

		const whitelisted = await UserService.isWhitelisted(member.id, member.guild.id);
		const whitelistOn = await GuildService.isWhitelistOnly(member.guild.id);
		
		if (whitelistOn && !whitelisted) {
			logger.info(`User ${member.user.tag} is not whitelisted! Kicking...`);
			
			await member.send(`Hey. You tried to join ${member.guild.name}, but you're not whitelisted. If you think this was a mistake, contact an admin.`);
			await member.kick();
			return;
		}
	}
};

export default userJoinEvent;