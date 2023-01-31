import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';
import cron from 'node-cron';
import { Client } from 'discord.js';

export interface Task {
	schedule: string;
	execute: (client: Client) => Promise<void>;
}

declare module 'discord.js' {
	interface Client {
		tasks: Task[];
	}
}

export const registerTasks = async (client: Client) => {
	client.tasks = [];

	const taskPath = path.join(__dirname, '../tasks');
	const taskFiles = fs.readdirSync(taskPath).filter(file => file.endsWith('.task.js'));

	for (const file of taskFiles) {
		const filePath = path.join(taskPath, file);
		const { default: task } = await import(filePath) as { default: Task };

		if (!task?.schedule || !task?.execute) {
			logger.warn(`Task file "${file}" is missing schedule or execute! Skipping...`);
			continue;
		}

		if (!cron.validate(task.schedule)) {
			logger.warn(`Task file "${file}" has an invalid schedule! Skipping...`);
			continue;
		}

		client.tasks.push(task);
	}

	logger.info(`Registered ${client.tasks.length} tasks!`);
};