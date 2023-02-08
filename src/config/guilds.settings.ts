export interface GuildSettings {
	alt: string;
	guildId: string;
	moderatorRole?: string;
	defaultRole?: string;
	logsChannel?: string;
	commands?: string[];
}

const settings: GuildSettings[] = [
	{
		alt: 'luda-cafe',
		guildId: '1024188032829628497',
		moderatorRole: '1031998008449052714',
		defaultRole: '1041190680212545657',
		logsChannel: '1053394569519185951',
		commands: ['yiff', 'error-test', 'get-activity', 'play']
	},
	{
		alt: 'content-styled',
		guildId: '1072591534588965075',
		moderatorRole: '1072594675598377031',
		defaultRole: '1072609132873535590',
		logsChannel: '1072930054650208296',
		commands: []
	}
];

export default settings;