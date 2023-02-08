import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const getString = (key: string, defaultValue?: string) => {
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