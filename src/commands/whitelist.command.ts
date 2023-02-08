import { UserService } from '@services';
import { requiresModerator, errorWrapper } from '@middlewares';
import { Command } from '@interfaces';

import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';

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

	middlewares: [errorWrapper, requiresModerator],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const { guild } = interaction;
		if (!guild) throw new Error('Couldn\'t find user guild.');

		const user = interaction.options.getUser('user', true);
		const remove = interaction.options.getBoolean('remove', false) ?? false;
		
		await UserService.whitelistUser(user.id, guild.id, remove);

		await interaction.editReply({
			content: `User updated! <@${user.id}> is now ${remove ? 'whitelisted' : 'blacklisted'}.`
		});
	}
};

export default whitelistedCommand;