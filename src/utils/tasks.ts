import { Client } from 'discord.js';
import { ModuleValidator, searchModules } from '@utils/files';
import { Task } from '@interfaces';
import logger from '@utils/logger';
import cron from 'node-cron';

declare module 'discord.js' {
	interface Client {
		tasks: Map<string, Task>;
	}
}

const validateTask: ModuleValidator = async (module: unknown, filename: string): Promise<boolean> => {
	if (!module || typeof module !== 'object') {
		logger.warn(`Task file "${filename}" is not an object! Skipping...`);
		return false;
	}

	const { default: task } = module as { default: Task };

	if (!task?.schedule || !task?.execute) {
		logger.warn(`Task file "${filename}" is missing schedule or execute! Skipping...`);
		return false;
	}

	return true;
};

export const tasksErrorHandler = (execute: (client: Client) => Promise<void>) => (client: Client) => {
	try {
		return execute(client);
	} catch (error) {
		logger.error(error);
	}
};

export const registerTasks = async (client: Client) => {
	client.tasks = new Map();

	const modules = await searchModules({
		folder: 'tasks',
		extension: '.task.js',
		recursive: true
	}, validateTask);

	for (const module of modules) {
		const { default: task } = module as { default: Task };

		if (!cron.validate(task.schedule)) {
			logger.warn(`Task file "${task.name}" has an invalid schedule! Skipping...`);
			continue;
		}

		if (task.disabled) {
			logger.warn(`Task file "${task.name}" is disabled! Skipping...`);
			continue;
		}

		client.tasks.set(task.name, task);
	}

	logger.info(`Registered ${client.tasks.size} tasks!`);
};