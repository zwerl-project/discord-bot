import { isWhitelisted, whitelistUser } from '@services/users';
import { Command } from '@utils/commands';
import config from '@utils/config';
import logger from '@utils/logger';
import { ChatInputCommandInteraction, Guild, GuildMember, SlashCommandBuilder } from 'discord.js';

const whitelistedCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('update-users')
		.setDescription('Registers all users to the database.')
		.setDMPermission(false),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const guild = interaction.guild as Guild;

		const member = interaction.member as GuildMember;
		if (!member.roles.cache.has(config.moderatorRole)) {
			interaction.editReply('You do not have enough permissions to use this command!');
			return;
		}

		await guild.members.cache.each(async user => {
			await whitelistUser(user.id);
			const whitelisted = await isWhitelisted(user.id);

			logger.info(`Updated user ${user.displayName} (${user.id}) => ${whitelisted === true ? 'whitelisted' : 'blacklisted'}.`);
		});

		await interaction.editReply('Memebers have been updated!');
	}
};

export default whitelistedCommand;