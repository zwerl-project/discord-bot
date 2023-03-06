import { CommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/commands';
import { EmbedService } from '@services';
import { Command } from '@interfaces';

const userOption = new SlashCommandUserOption()
	.setName('user')
	.setDescription('The target user to get the activities from.')
	.setRequired(true);

const getActivityCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('get-activity')
		.addUserOption(userOption)
		.setDescription('Returns the current activity of the user.')
		.setDMPermission(false),

	middlewares: [errorWrapper, requiresModerator],
	local: true,

	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		// Obtain the guild and the target user.
		const guild = interaction.guild;
		const target = interaction.options.getUser('user');

		if (!guild) throw new Error('Couldn\'t find user guild.');
		if (!target) throw new Error('Couldn\'t find the target user.');

		// Obtain the target user's presence.
		const presences = Array.from(guild.presences.cache.values());
		const targetsPresence = presences.find(presence => presence.userId === target.id);

		if (!targetsPresence) throw new Error('Couldn\'t retrive user\'s presence.');

		// Create the activity embed and send it.
		const activityEmbed = await EmbedService.createActivityEmbed(target, targetsPresence);
		
		await interaction.editReply(`Shown activities for user <@${target.id}>`);
		await interaction.channel?.send({ embeds: [activityEmbed] });
	}
};

export default getActivityCommand;