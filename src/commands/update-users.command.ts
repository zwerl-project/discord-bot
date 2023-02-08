import { ChatInputCommandInteraction, Guild, SlashCommandBuilder } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares';
import { UserService } from '@services';
import { Command } from '@interfaces';

const whitelistedCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('update-users')
		.setDescription('Registers all users to the database.')
		.setDMPermission(false),


	middlewares: [errorWrapper, requiresModerator],
	
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const guild = interaction.guild as Guild;

		await guild.members.cache.each(async user => {
			await UserService.whitelistUser(user.id, guild.id);
		});

		await interaction.editReply('Memebers have been updated!');
	}
};

export default whitelistedCommand;