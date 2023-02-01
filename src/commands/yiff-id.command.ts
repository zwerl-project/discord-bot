import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { errorWrapper, onlyNSFW } from '@middlewares/index';
import { createImageEmbed } from '@services/embeds';
import { Command } from '@utils/commands';
import { getPost } from '@services/yiff';

const tagsOption = new SlashCommandStringOption()
	.setName('id')
	.setDescription('The id of the post.')
	.setRequired(true);

const yiffIdCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('yiff-id')
		.addStringOption(tagsOption)
		.setDescription('Finds yiff with a specific id in e621.'),

	middlewares: [errorWrapper, onlyNSFW],

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const id = interaction.options.getString('id', true);

		// Get random post and send it
		const postData = await getPost(id);

		if (!postData) {
			await interaction.editReply({ content: 'Couldn\'t find any posts with the given tags.' });
			return;
		}

		const [postId, postUrl] = postData;

		const postEmbed = await createImageEmbed(postUrl, `E621 Post #${id}`, `https://e621.net/posts/${postId}`);
		await interaction.editReply({ embeds: [postEmbed] });
	}
};

export default yiffIdCommand;