import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { errorWrapper } from '@middlewares';
import { Command } from '@interfaces';

const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	middlewares: [errorWrapper],
	
	async execute(interaction: CommandInteraction) {
		await interaction.reply({ ephemeral: true, content: 'Pong!' });
	}
};

export default pingCommand;