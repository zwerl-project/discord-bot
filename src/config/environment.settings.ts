import { getString } from '@utils/environment';

export interface EnvironmentSettings {
	production: boolean;
	clientId: string;
	token: string;
}

const settings: EnvironmentSettings = {
	production: getString('NODE_ENV') === 'production',
	clientId: getString('CLIENT_ID'),
	token: getString('TOKEN')
};

export default settings;