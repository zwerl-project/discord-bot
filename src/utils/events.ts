import { Client } from 'discord.js';
import { Event } from '@interfaces';
import { ModuleValidator, searchModules } from '@utils/files';
import logger from '@utils/logger';

declare module 'discord.js' {
    interface Client {
        events: Map<string, Event>;
    }
}

const validateEvent: ModuleValidator = async (module: unknown, filename: string): Promise<boolean> => {
	if (!module || typeof module !== 'object') {
		logger.warn(`Event file "${filename}" is not an object! Skipping...`);
		return false;
	}

	const { default: event } = module as { default: Event };

	if (!event?.on || !event?.execute || !event?.name) {
		logger.warn(`Event file "${filename}" is missing name or execute! Skipping...`);
		return false;
	}

	return true;
};

const eventErrorHandler = (event: Event) => (...args: unknown[]) => {
	try {
		event.execute(...args);
	} catch (error) {
		logger.error(error);
	}
};

export const registerEvents = async (client: Client) => {
	client.events = new Map();

	const modules = await searchModules({
		folder: 'events',
		extension: '.event.js',
		recursive: true
	}, validateEvent);

	for (const module of modules) {
		const { default: event } = module as { default: Event };

		if (client.events.has(event.name)) {
			logger.warn(`Event "${event.name}" is already registered! Skipping...`);
			continue;
		}

		if (event.disabled) {
			logger.warn(`Event "${event.name}" is disabled! Skipping...`);
			continue;
		}

		client.events.set(event.name, event);

		if (event.once) {
			client.once(event.on, eventErrorHandler(event));
			continue;
		}

		client.on(event.on, eventErrorHandler(event));
	}

	logger.info(`Registered ${client.events.size} events!`);
};