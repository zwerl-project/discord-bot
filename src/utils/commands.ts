import { Client, REST, Routes } from 'discord.js';
import { EnvironmentSettings, GuildSettings } from '@config';
import { GuildService } from '@services';
import { Command } from '@interfaces';
import { ModuleValidator, searchModules } from '@utils/files';
import logger from '@utils/logger';

declare module 'discord.js' {
    interface Client {
        commands: Map<string, Command>;
    }
}

const validateCommand: ModuleValidator = async (module: unknown, filename: string): Promise<boolean> => {
	if (!module || typeof module !== 'object') {
		logger.warn(`Command file "${filename}" is not an object! Skipping...`);
		return false;
	}

	const { default: command } = module as { default: Command };

	if (!command?.data || !command?.execute) {
		logger.warn(`Command file "${filename}" is missing data or execute! Skipping...`);
		return false;
	}

	return true;
};

export const registerCommands = async (client: Client) => {
	client.commands = new Map();

	const modules = await searchModules({
		folder: 'commands',
		extension: '.command.js',
		recursive: true
	}, validateCommand);

	for (const module of modules) {
		const { default: command } = module as { default: Command };

		if (client.commands.has(command.data.name)) {
			logger.warn(`Command "${command.data.name}" is already registered! Skipping...`);
			continue;
		}

		if (command.disabled) {
			logger.warn(`Command "${command.data.name}" is disabled! Skipping...`);
			continue;
		}
		
		client.commands.set(command.data.name, command);
	}

	logger.info(`Registered ${client.commands.size} commands!`);
};

const getCommandsForGuild = async (commands: Command[], guildId: string) => {
	const guild = await GuildService.getGuildInfoById(guildId);
	if (!guild) return [];

	const guildCommands = commands
		.filter(command => {
			if (!command.local) return true;

			const guildCommand = guild.commands?.find(guildCommand => guildCommand === command.data.name);
			if (!guildCommand) return false;
			return true;
		})
		.map(command => command.data.toJSON());
	
	return guildCommands;
};


export const deployCommands = async (client: Client, rest: REST) => {
	const commands = Array.from(client.commands.values());

	try {
		for await (const guildInfo of GuildSettings) {
			if (!client.guilds.cache.has(guildInfo.guildId)) {
				logger.warn(`Guild ${guildInfo.alt} (${guildInfo.guildId}) is not in cache! Skipping...`);
				continue;
			}

			const guildCommands = await getCommandsForGuild(commands, guildInfo.guildId);

			await rest.put(
				Routes.applicationGuildCommands(EnvironmentSettings.clientId, guildInfo.guildId),
				{ body: guildCommands }
			);
		}

		logger.info('Deployed commands to REST!');
	} catch (error) {
		logger.warn('There was an error while deploying commands to REST!', error);

		if (!EnvironmentSettings.production)
			logger.error(error);
	}
};