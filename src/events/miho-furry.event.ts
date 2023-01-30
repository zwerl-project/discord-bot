import { Events, GuildMember } from 'discord.js';
import { Event } from '@utils/events';

const MihoFurryEvent: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(_: GuildMember, member: GuildMember) {
		if (member.id !== '1052691949729099917') return;

		const name = member.displayName;
		if (!name.toLowerCase().includes('furry')) 
			await member.setNickname(name + ' (furry)');
	}
};

export default MihoFurryEvent;