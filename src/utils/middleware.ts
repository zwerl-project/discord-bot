import { CommandInteraction } from 'discord.js';

export interface Middleware {
	execute: (interaction: CommandInteraction, next: (params: unknown) => Promise<void>) => Promise<void>;
}