import { Events, GuildMember } from 'discord.js';
import { Event } from '@interfaces';
import { UserService, GuildService } from '@services';
import logger from '@utils/logger';

// TODO: devide this event into two: user-join and whitelist-check
const userJoinEvent: Event = {
	name: 'extras-user-join',
	on: Events.GuildMemberAdd,
	once: false,
	async execute(member: GuildMember) {
		logger.info(`User ${member.user.tag} joined guild ${member.guild.name}`);

		// check if user is already in database
		const whitelisted = await UserService.isWhitelisted(member.id, member.guild.id);
		const whitelistOn = await GuildService.isWhitelistOnly(member.guild.id);
		if (whitelistOn && !whitelisted) {
			logger.info(`User ${member.user.tag} is not whitelisted! Kicking...`);
			
			await member.send(`Hey. You tried to join ${member.guild.name}, but you're not whitelisted. If you think this is a mistake, contact an admin.}`);
			await member.kick();
			return;
		}

		// get system message's channel
		const channel = member.guild.systemChannel;
		if (!channel) return;

		// send system message
		await channel.send(`Welcome to the server, ${member}!`);
       
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