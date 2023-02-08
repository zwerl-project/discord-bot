import { Client, Guild } from 'discord.js';
import { GuildSettings } from '@config';
import prisma from '@utils/prisma';

export const getOrCreateGuild = (guildId: string) => {
	const guild = prisma.guild.findUnique({
		where: {
			guildId: guildId
		}
	});

	if (!guild) {
		return prisma.guild.create({
			data: {
				guildId: guildId
			}
		});
	}

	return guild;
};

export const getGuilds = () => {
	return prisma.guild.findMany();
};

export const isWhitelistOnly = async (guildId: string) => {
	const guild = await getOrCreateGuild(guildId);
	return guild?.whitelistEnabled;
};

export const whitelistSet = async (guildId: string, whitelistEnabled: boolean) => {
	return await prisma.guild.upsert({
		where: {
			guildId: guildId
		},
		update: {
			whitelistEnabled
		},
		create: {
			guildId: guildId,
			whitelistEnabled
		}
	});
};


export const getGuildInfo = async (alt: string) => {
	return GuildSettings.find((g) => g.alt === alt);
};

export const getGuildInfoById = async (guildId: string) => {
	return GuildSettings.find((g) => g.guildId === guildId);
};

export const getGuild = async (client: Client<true>, alt: string) => {
	const guildInfo = await getGuildInfo(alt);
	if (!guildInfo) return undefined;

	return client.guilds.cache.get(guildInfo.guildId);
};


export const getLogsChannel = async (guild: Guild) => {
	const guildInfo = await getGuildInfoById(guild.id);
	if (!guildInfo?.logsChannel) return undefined;

	return guild.channels.cache.get(guildInfo.logsChannel);
};

export const getModerationRole = async (guild: Guild) => {
	const guildInfo = await getGuildInfoById(guild.id);
	if (!guildInfo?.moderatorRole) return undefined;

	return guild.roles.cache.get(guildInfo.moderatorRole);

};

export const getDefaultRole = async (guild: Guild) => {
	const guildInfo = await getGuildInfoById(guild.id);
	if (!guildInfo?.defaultRole) return undefined;

	return guild.roles.cache.get(guildInfo.defaultRole);
};
