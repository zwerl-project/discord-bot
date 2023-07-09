import { getNumber, getString } from '@utils/environment';

export interface EnvironmentSettings {
	port: number;
	production: boolean;
	clientId: string;
	token: string;
	build: string;
}

const settings: EnvironmentSettings = {
	port: getNumber('PORT'),
	production: getString('NODE_ENV') === 'production',
	clientId: getString('CLIENT_ID'),
	token: getString('TOKEN'),
	build: getString('COMMIT_SHA', 'unknown'),
};

export default settings;