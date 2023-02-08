import { Client } from 'discord.js';

interface Task {
	name: string;
	schedule: string;
	execute: (client: Client) => Promise<void>;
}

export default Task;