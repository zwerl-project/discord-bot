import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares/index';
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

	middlewares: [errorWrapper, requiresModerator],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const tags = interaction.options.getString('tags', false);

		// Get random post and send it
		let postUrl;

		if (!tags) postUrl = await getRandomPost();
		else postUrl = await searchPosts(tags);

		if (!postUrl) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const postEmbed = await createImageEmbed(postUrl, 'Random E621 Post');
		await interaction.editReply({ embeds: [postEmbed] });
	}
};

export default yiffCommand;