import { Events, GuildMember } from 'discord.js';
import { Event } from '@interfaces';
import { GuildService } from '@services';

const MihoFurryEvent: Event = {
	name: 'miho-furry',
	on: Events.GuildMemberUpdate,
	once: false,
	async execute(_: GuildMember, member: GuildMember) {
		const ludaGuild = await GuildService.getGuildInfo('luda-cafe');

		if (member.guild.id !== ludaGuild?.guildId) return;
		if (member.id !== '1052691949729099917') return;

		const name = member.displayName;
		if (!name.toLowerCase().includes('furry')) 
			await member.setNickname(name + ' (furry)');
	}
};

export default MihoFurryEvent;