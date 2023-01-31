import { Middleware } from '@utils/middleware';
import logger from '@utils/logger';

const errorWrapper: Middleware = {
	async execute(interaction, next) {
		try {
			await next(interaction);
		} catch (error) {
			logger.error(error);

			if (!interaction.replied && !interaction.deferred)
				await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
			else if (interaction.deferred)
				await interaction.editReply({ content: 'An error occurred while executing this command!' });
		}
	}
};

export default errorWrapper;
