import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

import { Client, Collection } from 'discord.js';

export interface Event {
    name: string;
    once: boolean;
    execute(...args: unknown[]): Promise<void>;
}

declare module 'discord.js' {
    interface Client {
        events: Collection<string, Event>;
    }
}

const eventErrorHandler = (execute: (...args: unknown[]) => Promise<void>) => (...args: unknown[]) => {
	try {
		return execute(...args);
	} catch (error) {
		logger.error(error);
	}
};

export const registerEvents = async (client: Client) => {
	logger.info('Registering events...');

	client.events = new Collection();

	const eventPath = path.join(__dirname, '../events');
	const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.event.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventPath, file);
		const { default: event } = await import(filePath) as { default: Event };

		if (!event?.name || !event?.execute) {
			logger.warn(`Event file "${file}" is missing name or execute! Skipping...`);
			continue;
		}

		client.events.set(event.name, event);

		if (event.once) {
			client.once(event.name, eventErrorHandler(event.execute));
			continue;
		}

		client.on(event.name, eventErrorHandler(event.execute));
	}

	logger.info(`Registered ${client.events.size} events!`);
};