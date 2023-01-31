import { Task } from '@utils/tasks';
import { Client } from 'discord.js';
import config from '@utils/config';

let timer = 0;

const getColor = (time: number): [red: number, green: number, blue: number] => {
	const r = Math.floor(Math.sin(time * 2 * Math.PI) * 127 + 128);
	const g = Math.floor(Math.sin(time * 2 * Math.PI + 2 * Math.PI / 3) * 127 + 128);
	const b = Math.floor(Math.sin(time * 2 * Math.PI + 4 * Math.PI / 3) * 127 + 128);

	return [r, g, b];
};

const RainbowRoleTask: Task = {
	schedule: '*/0.1 * * * * *',
	execute: async (client: Client) => {
		timer = (timer + 0.02) % 1;

		const guild = client.guilds.cache.get(config.guildId);
		const role = guild?.roles.cache.get(config.moderatorRole);

		if (!role) return;
		role.setColor(getColor(timer), 'rainbow role');
	}
};

export default RainbowRoleTask;