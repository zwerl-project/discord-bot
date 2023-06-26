import { Client } from 'discord.js';

interface Task {
	name: string;
	schedule: string;
	disabled?: boolean;
	execute: (client: Client) => Promise<void>;
}

export default Task;