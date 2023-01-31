import { ChatInputCommandInteraction, Guild, SlashCommandBuilder } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/index';
import { isWhitelisted, whitelistUser } from '@services/users';
import { Command } from '@utils/commands';
import logger from '@utils/logger';

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
			await whitelistUser(user.id);
			const whitelisted = await isWhitelisted(user.id);

			logger.info(`Updated user ${user.displayName} (${user.id}) => ${whitelisted === true ? 'whitelisted' : 'blacklisted'}.`);
		});

		await interaction.editReply('Memebers have been updated!');
	}
};

export default whitelistedCommand;