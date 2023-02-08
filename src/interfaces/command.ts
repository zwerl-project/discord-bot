import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Middleware from './middleware';

interface Command extends Middleware {
	local?: boolean;
	disabled?: boolean;
	middlewares?: Middleware[];
	data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export default Command;