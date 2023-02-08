import logger from '@utils/logger';
import prisma from '@utils/prisma';

export const getUser = async (userId: string) => {
	// get user from database, create if it doesn't exist
	const user = await prisma.user.upsert({
		where: {
			userId
		},
		update: {},
		create: {
			userId
		}
	});

	return user;
};


export const isWhitelisted = async (userId: string, guildId: string) => {
	const user = await getUser(userId);
	return user.whitelistedGuilds.includes(guildId);
};

export const whitelistUser = async (userId: string, guildId: string, remove = false) => {
	const user = await getUser(userId);

	const whitelistedGuilds = user.whitelistedGuilds;

	if (remove) {
		const index = whitelistedGuilds.indexOf(guildId);
		if (index > -1) {
			whitelistedGuilds.splice(index, 1);
		}
	} else {
		whitelistedGuilds.push(guildId);
	}

	logger.info(`User ${userId} has been ${remove ? 'removed from' : 'added to'} the whitelist for guild ${guildId}.`);

	return await prisma.user.update({
		where: {
			userId
		},
		data: {
			whitelistedGuilds
		}
	});
};

