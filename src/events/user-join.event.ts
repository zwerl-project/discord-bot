import { Events, GuildMember } from "discord.js";
import { Event } from "@utils/events";
import logger from "@utils/logger";
import config from "@utils/config";

const userJoinEvent: Event = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member: GuildMember) {
        logger.info(`User ${member.user.tag} joined guild ${member.guild.name}`);

        // get system message's channel
        const channel = member.guild.systemChannel;
        if (!channel) return;

        // send system message
        await channel.send(`Welcome to the server, ${member}!`);
       
        // get default role
        if (!config.defaultRole) {
            logger.warn(`No default role configured! Couldn't assign role to ${member.user.tag}`);
            return;
        }

        // add default role
        const defaultRole = member.guild.roles.cache.find(role => role.id === config.defaultRole);
        if (!defaultRole) {
            logger.warn(`Default role not found! Couldn't assign role to ${member.user.tag}`);
            return;
        }

        await member.roles.add(defaultRole);
    }
};

export default userJoinEvent;