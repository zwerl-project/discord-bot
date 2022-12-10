import fs from "fs";
import path from "path";
import config from "@utils/config"; 
import logger from "@utils/logger";

import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Collection, CommandInteraction, REST, Routes } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
};

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
    }
}

export const registerCommands = async (client: Client) => {
    logger.info("Registering commands...")

    client.commands = new Collection(); 

    const commandPath = path.join(__dirname, "../commands");
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".command.js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const { default: command } = await import(filePath) as { default: Command };

        if (!command?.data || !command?.execute) {
            logger.warn(`Command file \"${file}\" is missing data or execute! Skipping...`);
            continue;
        }
        client.commands.set(command.data.name, command);
    };

    logger.info(`Registered ${client.commands.size} commands!`);
}

export const deployCommands = async (client: Client, rest: REST) => {
    logger.info("Deploying commands to REST...")

    const commands = client.commands.map(command => command.data.toJSON());

    try {
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
    } catch (error) {
        logger.warn("There was an error while deploying commands to REST!", error);
    }
}