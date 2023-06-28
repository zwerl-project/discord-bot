import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { errorWrapper, onlyNSFW } from '@middlewares';
import { YiffService, EmbedService } from '@services';
import { Command } from '@interfaces';

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
		const postData = await YiffService.getPost(id);

		if (!postData) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const [postId, postUrl] = postData;

		const postEmbed = await EmbedService.createImageEmbed(postUrl, `E621 Post #${id}`, `https://e621.net/posts/${postId}`);
		await interaction.editReply({ embeds: [postEmbed] });
	},

	async searchPost(interaction: ChatInputCommandInteraction) {
		const tags = interaction.options.getString('tags', false);

		if (!tags) {
			await interaction.editReply({ content: 'Please provide tags to search for.' });
			return;
		}

		const posts = await YiffService.searchPosts(tags);

		if (!posts) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const postsEmbeds = await EmbedService.createE621SearchEmbed(tags)
		await interaction.editReply({ embeds: [postsEmbeds], files: posts.map(post => post[1])});
	}
};

export default yiffCommand;