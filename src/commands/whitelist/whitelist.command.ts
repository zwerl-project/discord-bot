import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { requiresModerator, errorWrapper } from '@middlewares';
import { GuildService, UserService } from '@services';
import { Command } from '@interfaces';


const enableWhitelistSubCommand = new SlashCommandSubcommandBuilder()
	.setName('enable')
	.setDescription('Enables whitelist.');

const disableWhitelistSubCommand = new SlashCommandSubcommandBuilder()
	.setName('disable')
	.setDescription('Disables whitelist.');

const whilistUserSubCommand = new SlashCommandSubcommandBuilder()
	.setName('user')
	.setDescription('Whitelists a user.')
	.addUserOption(option => 
		option.setName('user')
			.setDescription('The target user to get the activities from.')
			.setRequired(true)
	)
	.addBooleanOption(option =>
		option.setName('remove')
			.setDescription('Removes a user from the whitelist.')
			.setRequired(false)
	);

interface WhitelistCommand extends Command {
	enableWhitelist: (interaction: ChatInputCommandInteraction) => Promise<void>;
	disableWhitelist: (interaction: ChatInputCommandInteraction) => Promise<void>;
	whitelistUser: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const whitelistedCommand: WhitelistCommand = {
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.setDescription('Manages guild whitelisting.')
		.addSubcommand(enableWhitelistSubCommand)
		.addSubcommand(disableWhitelistSubCommand)
		.addSubcommand(whilistUserSubCommand)
		.setDMPermission(false),

	middlewares: [errorWrapper, requiresModerator],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
		case 'enable':
			await this.enableWhitelist(interaction);
			break;
		case 'disable':
			await this.disableWhitelist(interaction);
			break;
		case 'user':
			await this.whitelistUser(interaction);
			break;
		default:
			throw new Error('Invalid subcommand.');
		}
	},

	async enableWhitelist(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		if (!guild) throw new Error('Couldn\'t find guild.');

		await GuildService.whitelistSet(guild.id, true);

		await interaction.editReply({
			content: 'Whitelist has been enabled!'
		});
	},

	async disableWhitelist(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		if (!guild) throw new Error('Couldn\'t find guild.');

		await GuildService.whitelistSet(guild.id, false);

		await interaction.editReply({
			content: 'Whitelist has been disabled!'
		});
	},

	async whitelistUser(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		if (!guild) throw new Error('Couldn\'t find guild.');

		const user = interaction.options.getUser('user', true);
		const remove = interaction.options.getBoolean('remove', false) ?? false;
		
		await UserService.whitelistUser(user.id, guild.id, remove);

		await interaction.editReply({
			content: `User updated! <@${user.id}> is now ${!remove ? 'whitelisted' : 'blacklisted'}.`
		});
	}
};

export default whitelistedCommand;