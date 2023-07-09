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
	.addStringOption(option => 
		option.setName('user-id')
			.setDescription('The id of the target user.')
			.setRequired(true)
	)
	.addBooleanOption(option =>
		option.setName('remove')
			.setDescription('Removes a user from the whitelist.')
			.setRequired(false)
	);

const registerUsersSubCommand = new SlashCommandSubcommandBuilder()
	.setName('register-users')
	.setDescription('Registers all users to the database.');


interface WhitelistCommand extends Command {
	enableWhitelist: (interaction: ChatInputCommandInteraction) => Promise<void>;
	disableWhitelist: (interaction: ChatInputCommandInteraction) => Promise<void>;
	whitelistUser: (interaction: ChatInputCommandInteraction) => Promise<void>;
	registerUsers: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const whitelistedCommand: WhitelistCommand = {
	data: new SlashCommandBuilder()
		.setName('whitelist')
		.setDescription('Manages guild whitelisting.')
		.addSubcommand(enableWhitelistSubCommand)
		.addSubcommand(disableWhitelistSubCommand)
		.addSubcommand(whilistUserSubCommand)
		.addSubcommand(registerUsersSubCommand)
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
		case 'register-users':
			await this.registerUsers(interaction);
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

		const userId = interaction.options.getString('user-id', true);
		const user = interaction.client.users.resolveId(userId);
		if (!user) throw new Error('Couldn\'t find user.');

		const remove = interaction.options.getBoolean('remove', false) ?? false;
		
		await UserService.whitelistUser(userId, guild.id, remove);

		await interaction.editReply({
			content: `User updated! <@${userId}> is now ${!remove ? 'whitelisted' : 'blacklisted'}.`
		});
	},

	async registerUsers(interaction: ChatInputCommandInteraction) {
		const { guild } = interaction;
		if (!guild) throw new Error('Couldn\'t find guild.');

		if (!await GuildService.isWhitelistOnly(guild.id)) {
			await interaction.editReply('Whitelist is not enabled! Please enable it first.');
			return;
		}

		guild.members.cache.each(async user => {
			await UserService.whitelistUser(user.id, guild.id);
		});

		await interaction.editReply('Memebers have been updated!');
	}

};

export default whitelistedCommand;