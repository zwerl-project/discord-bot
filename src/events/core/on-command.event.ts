import { CommandInteraction, Events } from 'discord.js';
import { Event } from '@interfaces';
import logger from '@utils/logger';

const onCommandEvent: Event = {
	name: 'core-command',
	on: Events.InteractionCreate,
	once: false,
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const { client } = interaction;
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			logger.warn(`Command ${interaction.commandName} not found! Are you sure it's registered?`);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			return;
		}

		try {
			if (!command.middlewares) return await command.execute(interaction);
			const middlewares = [...command.middlewares, command];

			let i = 0;

			const next = async (interaction: CommandInteraction) => {
				i++;
				if (i >= middlewares.length) return;
				await middlewares[i].execute(interaction, next as (interaction: unknown) => Promise<void>);
			};

			await middlewares[0].execute(interaction, next as (interaction: unknown) => Promise<void>);
		} catch (error) {
			console.error(error);
		}
	}
};

export default onCommandEvent;