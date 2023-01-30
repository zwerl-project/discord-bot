import { isWhitelisted, whitelistUser } from '@services/users';
import { Command } from '@utils/commands';
import config from '@utils/config';
import logger from '@utils/logger';
import { ChatInputCommandInteraction, GuildMember, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';

const userOption = new SlashCommandUserOption()
	.setName('user')
	.setDescription('The target user to get the activities from.')
	.setRequired(true);

const removeOption = new SlashCommandBooleanOption()
	.setName('remove')
	.setDescription('Removes a user from the whitelist.')
	.setRequired(false);

const whitelistedCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.setDescription('Whitelists user to enter the server.')
		.addUserOption(userOption)
		.addBooleanOption(removeOption)
		.setDMPermission(false),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		// check if user is admin
		const member = interaction.member as GuildMember;
		if (!member.roles.cache.has(config.moderatorRole)) {
			interaction.editReply('You do not have enough permissions to use this command!');
			return;
		}

		const user = interaction.options.getUser('user', true);
		const remove = interaction.options.getBoolean('remove', false) ?? false;
		
		await whitelistUser(user.id, remove);
		const whitelisted = await isWhitelisted(user.id);

		await interaction.editReply({
			content: `User updated! <@${user.id}> is now ${whitelisted === true ? 'whitelisted' : 'blacklisted'}.`
		});

		logger.info(`Updated user ${user.username} (${user.id}) => ${whitelisted === true ? 'whitelisted' : 'blacklisted'}.`);
	}
};

export default whitelistedCommand;