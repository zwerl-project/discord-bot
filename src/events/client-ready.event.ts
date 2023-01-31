import { Client, Events } from 'discord.js';
import { Event } from '@utils/events';
import logger from '@utils/logger';
import cron from 'node-cron';

const ClientReadyEvent: Event = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client<true>) {
		logger.info('Client ready! Logged in as ' + client.user?.tag + ' (' + client.user?.id + ')');

		const guilds = Array.from(client.guilds.cache.values());
		logger.info(`Guilds (${guilds.length}): ${guilds.map(guild => guild.name).join(', ')}`);

		for (const task of client.tasks.values()) {
			cron.schedule(task.schedule, () => task.execute(client));
		}
	}
};

export default ClientReadyEvent;