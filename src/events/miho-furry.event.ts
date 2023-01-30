import { Events, GuildMember } from 'discord.js';
import { Event } from '@utils/events';

const MihoFurryEvent: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(member: GuildMember) {
		if (member.id !== '1052691949729099917') return;
		const guild = member.guild;

		const user = guild.members.cache.find(user => user.id == member.id) as GuildMember;
		const name = user.displayName;
		if (!name.toLowerCase().includes('furry')) 
			await user.setNickname(name + ' (furry)');
	}
};

export default MihoFurryEvent;