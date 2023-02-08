import { CommandInteraction } from 'discord.js';

interface Middleware {
	execute: (interaction: CommandInteraction, next: (params: unknown) => Promise<void>) => Promise<void>;
}

export default Middleware;