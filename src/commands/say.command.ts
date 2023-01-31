import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, TextBasedChannel } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/index';
import { Command } from '@utils/commands';

const messageOption = new SlashCommandStringOption()
	.setName('message')
	.setDescription('Message to send in the channel.')
	.setRequired(true);

const sayCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('say')
		.addStringOption(messageOption)
		.setDescription('Sends a message as the bot.'),


	middlewares: [errorWrapper, requiresModerator],
	
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const channel = interaction.channel as TextBasedChannel;
		const message = interaction.options.getString('message', true);

		await channel.send(message);
		await interaction.editReply({ content: 'Message sent!'});
	}
};

export default sayCommand;