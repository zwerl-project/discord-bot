import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { errorWrapper, requiresModerator } from '@middlewares';
import { Command } from '@interfaces';

type TestType = 'normal' | 'replied' | 'deferred';

const testTypeOption = new SlashCommandStringOption()
	.setName('type')
	.setDescription('Type of error to test.')
	.addChoices({ name: 'normal', value: 'normal' }, { name: 'replied', value: 'replied' }, { name: 'deferred', value: 'deferred' })
	.setRequired(true);

const errorTestCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('error-test')
		.addStringOption(testTypeOption)
		.setDescription('Executes an error to test the error handler.'),

	middlewares: [errorWrapper, requiresModerator],
	local: true,
	
	async execute(interaction: ChatInputCommandInteraction) {
		const type: TestType = interaction.options.getString('type', true) as TestType;

		switch (type) {
		case 'normal':
			throw new Error('This is a normal error.');
		case 'replied':
			await interaction.reply({ content: 'This is a replied error.', ephemeral: true });
			throw new Error('This is a replied error.');
		case 'deferred':
			await interaction.deferReply({ ephemeral: true });
			throw new Error('This is a deferred error.');
		}
	}
};

export default errorTestCommand;