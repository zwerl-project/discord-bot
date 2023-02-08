import { TextChannel, VoiceChannel } from 'discord.js';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import ytdl from 'ytdl-core';
import logger from '@utils/logger';

type SongOrigin = 'youtube' | 'other';

interface Song {
	title: string;
	author: string;
	origin: SongOrigin;
	id: string;
}

interface PlayingSong extends Song {
	format: ytdl.videoFormat;
	timestamp: number;
}

class SongsService {
	private static isPaused = true;
	private static queue: Song[] = [];
	private static currentlyPlaying: PlayingSong | null = null;
	private static voiceChannel: VoiceChannel | null = null;
	private static infoChannel: TextChannel | null = null;

	public static async update() {
		return;
	}

	public static async addSong(song: Song) {
		this.queue.push(song);
	}

	public static async join(voiceChannel: VoiceChannel, infoChannel: TextChannel) {
		if (this.voiceChannel?.id === voiceChannel.id) return;
		if (this.voiceChannel && this.infoChannel) {
			this.infoChannel.send('I have been moved to another voice channel!');

			this.queue = [];
			this.currentlyPlaying = null;
			this.isPaused = true;
			
			const connection = getVoiceConnection(this.voiceChannel.guild.id);
			if (connection) connection.destroy();
		}
		
		this.voiceChannel = voiceChannel;
		this.infoChannel = infoChannel;

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator
		});

		connection.on('stateChange', async (oldState, newState) => {
			if (newState.status === 'disconnected') {
				this.voiceChannel = null;
				this.infoChannel = null;
				this.queue = [];
				this.currentlyPlaying = null;
				this.isPaused = true;
			}
		});

		connection.on('error', async (error) => {
			if (this.infoChannel) this.infoChannel.send('An error occured while playing music!');
			logger.error(error);
		});
	}

	public static async getSong(url: string): Promise<Song | undefined> {
		try {
			const song = await ytdl.getInfo(url);
			return {
				title: song.videoDetails.title,
				author: song.videoDetails.author.name,
				id: song.videoDetails.videoId,
				origin: 'youtube'
			};
		} catch {
			return undefined;
		}
	}

	public static async getVoiceChannel(): Promise<VoiceChannel | null> {
		return this.voiceChannel;
	}

	public static async setVoiceChannel(voiceChannel: VoiceChannel | null) {
		this.voiceChannel = voiceChannel;
	}

	public static async getInfoChannel(): Promise<TextChannel | null> {
		return this.infoChannel;
	}

	public static async setInfoChannel(infoChannel: TextChannel | null) {
		this.infoChannel = infoChannel;
	}
	
	public static async getQueue(): Promise<Song[]> {
		return this.queue;
	}
}

export default SongsService;