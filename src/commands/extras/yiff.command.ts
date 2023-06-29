import { ChatInputCommandInteraction, RawFile, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { errorWrapper, onlyNSFW } from '@middlewares';
import { YiffService, EmbedService } from '@services';
import { Command } from '@interfaces';
import logger from '@utils/logger';

const postSubCommand = new SlashCommandSubcommandBuilder()
	.setName('post')
	.setDescription('Gets a post with the given id.')
	.addStringOption(options =>
		options
			.setName('id')
			.setDescription('The id of the post.')
			.setRequired(true)
	);

const searchSubCommand = new SlashCommandSubcommandBuilder()
	.setName('search')
	.setDescription('Searches for a post with the given tags.')
	.addStringOption(options => 
		options
			.setName('tags')
			.setDescription('Tags to search for.')
			.setRequired(true)
	)
	.addIntegerOption(options =>
		options
			.setName('limit')
			.setDescription('The amount of posts to search for.')
			.setRequired(false)
	)
	.addIntegerOption(options =>
		options
			.setName('page')
			.setDescription('The page to search for.')
			.setRequired(false)
	);


interface YiffCommand extends Command {
	getPost(interaction: ChatInputCommandInteraction): Promise<void>;
	searchPost(interaction: ChatInputCommandInteraction): Promise<void>;
}

const yiffCommand: YiffCommand = {
	data: new SlashCommandBuilder()
		.setName('yiff')
		.addSubcommand(postSubCommand)
		.addSubcommand(searchSubCommand)
		.setDescription('Finds yiff in e621 and sends it to the channel.'),

	middlewares: [errorWrapper, onlyNSFW],
	local: true,

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
		case 'post':
			await this.getPost(interaction);
			break;
		case 'search':
			await this.searchPost(interaction);
			break;
		}
	},

	async getPost(interaction: ChatInputCommandInteraction) {
		const id = interaction.options.getString('id', true);

		// Get random post and send it
		const post = await YiffService.getPost(id);

		if (!post) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}


		const embed = await EmbedService.createImageEmbed(post.url, `E621 Post #${id}`, `https://e621.net/posts/${post.id}`);
		await interaction.editReply({ embeds: [embed] });
	},

	async searchPost(interaction: ChatInputCommandInteraction) {
		const tags = interaction.options.getString('tags', true);
		const limit = interaction.options.getInteger('limit', false) ?? 5;
		const page = interaction.options.getInteger('page', false) ?? 1;

		if (!tags) {
			await interaction.editReply({ content: 'Please provide tags to search for.' });
			return;
		}

		const posts = await YiffService.searchPosts(tags, limit, page);

		if (!posts) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const files = posts.map(post => ({
			attachment: post.url,
			name: `post-${post.id}.${post.ext}`
		}));

		logger.info(`Found ${posts.length} posts with tags ${tags}.`);
		logger.info(files)

		const postsEmbeds = await EmbedService.createE621SearchEmbed(tags)
		await interaction.editReply({ files, embeds: [postsEmbeds] });
	}
};

export default yiffCommand;