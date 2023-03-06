import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, TextBasedChannel } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/commands';
import { Command } from '@interfaces';

const messageOption = new SlashCommandStringOption()
	.setName('content')
	.setDescription('The content of the message base64 encoded.')
	.setRequired(true);

const rawCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('raw')
		.addStringOption(messageOption)
		.setDescription('Sends a raw message as the bot.'),

	middlewares: [errorWrapper, requiresModerator],
	
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const channel = interaction.channel as TextBasedChannel;
		const raw = interaction.options.getString('content', true);

		const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));

		await channel.send(decoded);
		await interaction.editReply({ content: 'Message sent!'});
	}
};

export default rawCommand;