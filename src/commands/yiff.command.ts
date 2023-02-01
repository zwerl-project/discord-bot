import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { errorWrapper, onlyNSFW } from '@middlewares/index';
import { getRandomPost, searchPosts } from '@services/yiff';
import { Command } from '@utils/commands';
import { createImageEmbed } from '@services/embeds';

const tagsOption = new SlashCommandStringOption()
	.setName('tags')
	.setDescription('Tags to search for.')
	.setRequired(false);

const yiffCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('yiff')
		.addStringOption(tagsOption)
		.setDescription('Finds yiff in e621 and sends it to the channel.'),

	middlewares: [errorWrapper, onlyNSFW],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const tags = interaction.options.getString('tags', false);

		// Get random post and send it
		let postData;

		if (!tags) postData = await getRandomPost();
		else postData = await searchPosts(tags);

		if (!postData) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const [postId, postUrl] = postData;

		const postEmbed = await createImageEmbed(postUrl, 'Random E621 Post', `https://e621.net/posts/${postId}`);
		await interaction.editReply({ embeds: [postEmbed] });
	}
};

export default yiffCommand;