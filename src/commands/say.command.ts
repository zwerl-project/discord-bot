import { Command } from '@utils/commands';
import config from '@utils/config';
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandStringOption, TextBasedChannel } from 'discord.js';

const messageOption = new SlashCommandStringOption()
	.setName('message')
	.setDescription('Message to send in the channel.')
	.setRequired(true);

const sayCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('say')
		.addStringOption(messageOption)
		.setDescription('Sends a message as the bot.'),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const member = interaction.member as GuildMember;
		if (!member.roles.cache.has(config.moderatorRole)) {
			interaction.editReply('You do not have enough permissions to use this command!');
			return;
		}

		const channel = interaction.channel as TextBasedChannel;
		const message = interaction.options.getString('message', true);
		await channel.send(message);
		await interaction.editReply({ content: 'Message sent!'});
	}
};

export default sayCommand;