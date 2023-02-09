import { ModalBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const createBuilderApplicationModal = async () => {
	const modal = new ModalBuilder()
		.setCustomId('application_modal')
		.setTitle('Builder Application');

	const experienceInput = new TextInputBuilder()
		.setCustomId('building-experience')
		.setLabel('What\'s your current building experience?')
		.setPlaceholder('I\'ve been building for 3 years. I have worked on...')
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph);
		
	const experienceRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
		.addComponents(experienceInput);

	modal.addComponents(experienceRow);

	return modal;
};