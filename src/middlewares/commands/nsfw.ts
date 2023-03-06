import { TextChannel } from 'discord.js';
import { Middleware } from '@interfaces';
import logger from '@utils/logger';

const onlyNSFW: Middleware = {
	async execute(interaction, next) {
		const channel = interaction.channel;
		if (!channel?.isTextBased()) return;

		const textChannel = channel as TextChannel;

		if (!textChannel.nsfw) {
			logger.warn(`User ${interaction.user.username} (${interaction.user.id}) tried to use a NSFW command in a non-NSFW channel!`);
			interaction.reply({ ephemeral: true, content: 'You can only use this command in a NSFW channel!' });
			return;
		}

		await next(interaction);
	}
};

export default onlyNSFW;