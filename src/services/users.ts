import prisma from '@utils/prisma';

export const getUser = async (userId: string) => {
	// get user from database, create if it doesn't exist
	const user = await prisma.user.findUnique({
		where: {
			userId
		}
	});
	
	if (!user) {
		return await prisma.user.create({
			data: {
				userId
			}
		});
	}

	return user;
};


export const isWhitelisted = async (userId: string) => {
	const user = await getUser(userId);
	return user.whitelisted;
};

export const whitelistUser = async (userId: string, remove = false) => {
	const user = await getUser(userId);

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			whitelisted: !remove
		}
	});
};

