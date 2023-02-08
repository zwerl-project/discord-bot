/*
import { ChatInputCommandInteraction, Guild, GuildMember, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel, VoiceChannel } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/index';
import { SongsService } from '@services';
import { Command } from '@interfaces';

const playByIdSubcommand = new SlashCommandSubcommandBuilder()
	.setName('id')
	.setDescription('Finds a song by its ID')
	.addStringOption(option => 
		option
			.setName('id')
			.setDescription('The ID of the song')
			.setRequired(true)
	);
		

const playCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.addSubcommand(playByIdSubcommand)
		.setDescription('Plays a song in the voice channel you\'re in (experimental).'),
	
	middlewares: [errorWrapper, requiresModerator],
	local: true,
	
	async execute(interaction: ChatInputCommandInteraction) {
		/*
		await interaction.deferReply();

		const { member, guild } = interaction as { member: GuildMember, guild: Guild };
		if (!member || !guild) throw new Error('Couldn\'t get member or guild');

		const voiceChannel = guild.channels.cache.find(channel => channel)
		if (!voiceChannel) {
			await interaction.editReply('You need to be in a voice channel to play music!');
			return;
		}

		const infoChannel = interaction.channel as TextChannel;

		const permissions = voiceChannel.permissionsFor(interaction.client.user);
		if (!permissions || !permissions.has('Connect') || !permissions.has('Speak')) {
			await interaction.editReply('I need the permissions to join and speak in your voice channel!');
			return;
		}

		const song = interaction.options.getString('title', true);
		await interaction.editReply(`Now playing \`${song}\` in <#${voiceChannel.id}>!`);

		const subcommand = interaction.options.getSubcommand(true);
		if (subcommand === 'id') {
			const id = interaction.options.getString('id', true);
			const song = await SongsService.getSong(`https://www.youtube.com/watch?v=${id}`);

			if (!song) {
				await interaction.editReply('Couldn\'t find a song with that ID!');
				return;
			}

			await SongsService.addSong(song);
			await SongsService.join(voiceChannel, infoChannel);
			await SongsService.update();
			await interaction.editReply(`Now playing \`${song.title}\` by \`${song.author}\` in <#${voiceChannel.id}>!`);
		}
		
	}
};

export default playCommand;
*/