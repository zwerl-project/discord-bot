// register module-alias
require('module-alias/register');

import { Client, GatewayIntentBits, REST } from 'discord.js';
import { deployCommands, registerCommands } from '@utils/commands';
import { registerEvents } from '@utils/events';
import { registerTasks } from '@utils/tasks';
import { EnvironmentSettings } from '@config';
import logger from '@utils/logger';

const token = EnvironmentSettings.token;
const production = EnvironmentSettings.production;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const rest = new REST({version: '10'}).setToken(token);

const main = async () => {
	if (!production) logger.warn('Running in development mode!');

	// commands
	await registerCommands(client);
	await deployCommands(client, rest);

	// events
	await registerEvents(client);

	// tasks
	await registerTasks(client);

	client.login(token);
};

main().catch(error => logger.error(`Unexpected error occured: ${error}`));