import { Command } from "@utils/commands";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";

const userOptions = new SlashCommandUserOption()
    .setName("user")
    .setDescription("The target user to bean.")
    .setRequired(true);

const reasonOptions = new SlashCommandStringOption()
    .setName("reason")
    .setDescription("The reason for the bean.")
    .setRequired(false);


const pingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('bean')
        .setDescription('Beans a user')
        .addUserOption(userOptions)
        .addStringOption(reasonOptions)
        .setDMPermission(false),

    async execute(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: false });

        const user = interaction.options.getUser('user');

        if (!user) {
            await interaction.reply("An error has occured! Couldn't find the target user.");
            return;
        }

        const beanEmbed = new EmbedBuilder()
            .setTitle("User Beaned")
            .setColor(0x0099FF)
            .setThumbnail(user.avatarURL())
            .setDescription(`Beaned <@${user.id}>`)
            .addFields(
                { name: "Reason", value: interaction.options.get('reason')?.value as string || "No reason provided" },
                { name: "\"Responsible\" \"Moderator\"", value: `<@${interaction.user.id}>` }
            );
        
        await interaction.editReply({ embeds: [beanEmbed] });

    }
};

export default pingCommand;