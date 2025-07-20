const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setName('say')
        .setDescription('Make the bot send a message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to be sent')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply({
            content: message,
            ephemeral: true // Define como true para evitar spam visível. Pode ser alterado se necessário...
        });
    },
};
