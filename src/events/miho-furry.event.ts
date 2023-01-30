import { Events, GuildMember } from 'discord.js';
import { Event } from '@utils/events';

const ClientReadyEvent: Event = {
	name: Events.GuildMemberUpdate,
	once: false,
	async execute(member: GuildMember) {
		if (member.id !== '1052691949729099917') return;

		const name = member.displayName;
		if (!name.includes('furry')) await member.setNickname(name + ' (furry)');
	}
};

export default ClientReadyEvent;