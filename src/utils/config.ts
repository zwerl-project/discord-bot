import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    port: number;
    production: boolean;
    token: string;
    clientId: string;
    guildId: string;
};

export const get = (key: string, defaultValue?: any) => {
    if (defaultValue === undefined && process.env[key] === undefined)
        throw new Error(`Missing config value for key: ${key}`);

    return process.env[key] || defaultValue;
};

export const getNumber = (key: string, defaultValue?: number) => {
    const value = get(key, defaultValue);
    const number = parseInt(value, 10);

    if (isNaN(number))
        throw new Error(`Config value for key: ${key} is not a number`);

    return number;
}

const config: Config = {
    port: getNumber('PORT', 3000),
    production: get('NODE_ENV') === 'production',
    token: get('TOKEN'),
    clientId: get('CLIENT_ID'),
    guildId: get('GUILD_ID'),
};

export default config;