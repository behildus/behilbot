const { SlashCommandBuilder} =require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolechoice')
        .setDescription('Create role choice message')
        .addStringOption((option) =>
            option
                .setName('rolename')
                .setDescription('Name of the role')
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(500)
                .setAutocomplete(true)
        )
        .addStringOption((option) =>
            option
                .setName('emoji')
                .setDescription('Emoji to react with')
                .setRequired(true)
                .setMaxLength(500)
        ),
    async execute(interaction) {
        const message = await interaction.channel.send(`# React to get role\n${interaction.options.getString('rolename', true)}: ${interaction.options.getString('emoji', true)}`);
        message.react(interaction.options.getString('emoji', true))
        return await interaction.reply({content: 'Message added', ephemeral: true});
    }

}