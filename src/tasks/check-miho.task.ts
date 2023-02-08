import { Client } from 'discord.js';
import { Task } from '@interfaces';
import { GuildService } from '@services';

const MihoFurryCheck: Task = {
	name: 'miho-furry-check',
	schedule: '0 */3 * * *',
	execute: async (client: Client) => {
		const guild = await GuildService.getGuild(client, 'luda-cafe');
		if (!guild) return;

		const miho = guild.members.cache.get('1052691949729099917');
		if (!miho) return;

		const name = miho.displayName;
		if (!name.toLowerCase().includes('furry'))
			await miho.setNickname(name + ' (furry)');
	}
};

export default MihoFurryCheck;