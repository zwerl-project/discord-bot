import { ChatInputCommandInteraction, Guild, SlashCommandBuilder } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/commands';
import { GuildService, UserService } from '@services';
import { Command } from '@interfaces';

const whitelistedCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('register-users')
		.setDescription('Registers all users to the database.')
		.setDMPermission(false),


	middlewares: [errorWrapper, requiresModerator],
	
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const guild = interaction.guild as Guild;

		if (!await GuildService.isWhitelistOnly(guild.id)) {
			await interaction.editReply('Whitelist is not enabled! Please enable it first.');
			return;
		}

		await guild.members.cache.each(async user => {
			await UserService.whitelistUser(user.id, guild.id);
		});

		await interaction.editReply('Memebers have been updated!');
	}
};

export default whitelistedCommand;