import { Client, Events } from 'discord.js';
import { tasksErrorHandler } from '@utils/tasks';
import { GuildService } from '@services';
import { Event } from '@interfaces';
import logger from '@utils/logger';
import cron from 'node-cron';

const ClientReadyEvent: Event = {
	name: 'core-client-ready',
	on: Events.ClientReady,
	once: true,
	async execute(client: Client<true>) {
		logger.info('Client ready! Logged in as ' + client.user?.tag + ' (' + client.user?.id + ')');

		const guilds = Array.from(client.guilds.cache.values());
		logger.info(`Guilds (${guilds.length}): ${guilds.map(guild => guild.name).join(', ')}`);

		for await (const guild of guilds) {
			await GuildService.getOrCreateGuild(guild.id);
		}

		for (const task of client.tasks.values()) {
			cron.schedule(task.schedule, () => tasksErrorHandler(task.execute)(client));
		}
	}
};

export default ClientReadyEvent;