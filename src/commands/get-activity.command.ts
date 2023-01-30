import { Command } from '@utils/commands';
import { APIEmbedField, CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';

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

	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const user = interaction.options.getUser('user');

		if (!user) {
			await interaction.editReply('An error has occured! Couldn\'t find the target user.');
			return;
		}

		const guild = interaction.guild;

		if (!guild) {
			await interaction.editReply('An error has occured! Couldn\'t find user guild.');
			return;
		}

		const presences = Array.from(guild.presences.cache.values());
		const userPresence = presences.find(presence => presence.userId === user.id);

		if (!userPresence) {
			await interaction.editReply('An error has occured! Couldn\'t retrive user\'s presence.');
			return;
		}

		const activityEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('User Activity')
			.setThumbnail(user?.avatarURL())
			.addFields(
				{ name: 'Identification', value: `Target user: <@${user?.id}>\nCurrent status: \`${userPresence.clientStatus?.desktop}\`` },
			).addFields(userPresence.activities.map((activity): APIEmbedField => {
				return { 
					name: activity.name || 'Unknown Activity',
					value: `${activity.state}: ${activity.details}` || 'This activity has no details'
				};
			}));

		await interaction.editReply(`Shown activities for user <@${user.id}>`);
		await interaction.channel?.send({ embeds: [activityEmbed] });
	}
};

export default getActivityCommand;