import { Client } from 'discord.js';
import { Task } from '@utils/tasks';
import config from '@utils/config';

const MihoFurryCheck: Task = {
	schedule: '0 */3 * * *',
	execute: async (client: Client) => {
		const guild = client.guilds.cache.get(config.guildId);
		if (!guild) return;

		const miho = guild.members.cache.get('1052691949729099917');
		if (!miho) return;

		const name = miho.displayName;
		if (!name.toLowerCase().includes('furry'))
			await miho.setNickname(name + ' (furry)');
	}
};

export default MihoFurryCheck;