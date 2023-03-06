import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import { EmbedService } from '@services';
import { errorWrapper } from '@middlewares/commands';
import { Command } from '@interfaces';

const userOptions = new SlashCommandUserOption()
	.setName('user')
	.setDescription('The target user to bean.')
	.setRequired(true);

const reasonOptions = new SlashCommandStringOption()
	.setName('reason')
	.setDescription('The reason for the bean.')
	.setRequired(false);


const beanCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('bean')
		.setDescription('Beans a user')
		.addUserOption(userOptions)
		.addStringOption(reasonOptions)
		.setDMPermission(false),

	middlewares: [errorWrapper],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: false });

		// Get the user that beaned the target user.
		const sourceUser = interaction.user;

		// Get the target user and the reason.
		const targetUser = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason', false) ?? 'No reason provided.';
		
		if (!targetUser) 
			throw new Error('Couldn\'t find the target user.');

		const beanEmbed = await EmbedService.createBeanEmbed(sourceUser, targetUser, reason);
		await interaction.editReply({ embeds: [beanEmbed] });

	}
};

export default beanCommand;