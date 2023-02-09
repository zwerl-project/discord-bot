import { Command } from '@interfaces';
import { errorWrapper } from '@middlewares';
import { EmbedService, GuildService } from '@services';
import { ChannelType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel } from 'discord.js';

const builderSubCommand = new SlashCommandSubcommandBuilder()
	.setName('builder')
	.setDescription('Apply for the Builder role.');

const developerSubCommand = new SlashCommandSubcommandBuilder()
	.setName('developer')
	.setDescription('Apply for the Developer role.');


interface ApplyCommand extends Command {
	applyForBuilder: (interaction: ChatInputCommandInteraction) => Promise<void>;
	applyForDeveloper: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const applyCommand: ApplyCommand = {
	data: new SlashCommandBuilder()
		.setName('apply')
		.addSubcommand(builderSubCommand)
		.addSubcommand(developerSubCommand)
		.setDescription('Apply for a role in the Content Styled server.'),


	middlewares: [errorWrapper],
	local: true,
	disabled: false,

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'builder') {
			await this.applyForBuilder(interaction);
		} else if (subcommand === 'developer') {
			await this.applyForDeveloper(interaction);
		}
	},

	async applyForBuilder(interaction: ChatInputCommandInteraction) {
		const member = interaction.member as GuildMember;

		const guild = await GuildService.getGuild(interaction.client, 'content-styled');
		if (!guild) throw new Error('Guild not found.');

		const channel = guild.channels.cache.find(channel => channel.id === '1072745108430135336') as TextChannel;
		if (!channel) throw new Error('Channel not found.');
		
		const thread = await channel.threads
			.create({ name: `Builder application from ${member.displayName}`, reason: 'Started a new application', type: ChannelType.PrivateThread });

		await thread.members.add(member);

		const embed = await EmbedService.createBuilderApplicationEmbed(member, 'pending');
		const buttons = await EmbedService.createBuilderApplicationComponents();

		await thread.send({ embeds: [embed], components: [buttons] });
		await thread.send({ content: `**Attention:** ${member} you have started an application, please respond to the questions in this thread. Beware that you may close this application at any point by clicking the red button above. The moderator <@221054071736369152> will be reviewing it- Please, be paitient and **do not ping them to make the process go faster**.` });
		
		await interaction.editReply({ content: 'A new thread was created for your application, follow the ping!' });
	},

	async applyForDeveloper(interaction: ChatInputCommandInteraction) {
		await interaction.reply({ ephemeral: true, content: 'Developer applications are currently closed.' });
	}
};

export default applyCommand;