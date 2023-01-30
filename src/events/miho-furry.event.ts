import { Events, GuildMember } from 'discord.js';
import { Event } from '@utils/events';

const MihoFurryEvent: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(oldMember: GuildMember, newMember: GuildMember) {
		if (newMember.id !== '1052691949729099917') return;

		const name = oldMember.displayName;
		if (!name.toLowerCase().includes('furry')) 
			await newMember.setNickname(name + ' (furry)');
	}
};

export default MihoFurryEvent;