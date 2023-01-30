import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    port: number;
    production: boolean;
    token: string;
    clientId: string;
    guildId: string;
	moderatorRole: string;
	defaultRole: string;
	logsChannel: string;
}

export const get = (key: string, defaultValue?: string) => {
	const value = process.env[key] ?? defaultValue;

	if (value === undefined) 
		throw new Error(`Missing config value for key: ${key}`);

	return value;
};

export const getNumber = (key: string, defaultValue?: number) => {
	const value = Number(process.env[key] ?? defaultValue);
	if (value === undefined) 
		throw new Error(`Missing config value for key: ${key}`);

	return value;
};

const config: Config = {
	port: getNumber('PORT', 3000),
	production: get('NODE_ENV') === 'production',
	token: get('TOKEN'),
	clientId: get('CLIENT_ID'),
	guildId: get('GUILD_ID'),
	moderatorRole: get('MODERATOR_ROLE'),
	defaultRole: get('DEFAULT_ROLE'),
	logsChannel: get('LOGS_CHANNEL'),
};

export default config;