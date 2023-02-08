import { Events, GuildMember } from 'discord.js';
import { Event } from '@interfaces';
import { GuildService, UserService } from '@services';
import logger from '@utils/logger';

const userJoinEvent: Event = {
	name: 'extras-user-join',
	on: Events.GuildMemberAdd,
	once: false,
	async execute(member: GuildMember) {
		logger.info(`User ${member.user.tag} joined guild ${member.guild.name}`);

		const whitelisted = await UserService.isWhitelisted(member.id, member.guild.id);
		const whitelistOn = await GuildService.isWhitelistOnly(member.guild.id);
		if (whitelistOn && !whitelisted) return;
		
		// get system message's channel
		const channel = member.guild.systemChannel;
		if (channel) {
			await channel.send(`Welcome to the server, ${member}!`);
		}
       
		// get default role
		const defaultRole = await GuildService.getDefaultRole(member.guild);
		if (!defaultRole) {
			logger.warn(`Default role not found! Couldn't assign role to ${member.user.tag}`);
			return;
		}

		await member.roles.add(defaultRole);
	}
};

export default userJoinEvent;