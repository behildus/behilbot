const { SlashCommandBuilder} =require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrolechoice')
        .setDescription('Add role choice option')
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
        await interaction.channel.messages.fetch();
        const oldMessage = await interaction.channel.lastMessage;
        const oldText = oldMessage.content

        const oldArray = oldText.split('\n');
        const newText = oldText.concat(`\n${interaction.options.getString('rolename', true)}: ${interaction.options.getString('emoji', true)}`);
        oldMessage.delete();
        const message = await interaction.channel.send(newText);

        for (let i = 1; i < oldArray.length; i++) {
            const roleArray = await oldArray[i].split(": ");
            message.react(roleArray[1]);
        }
        message.react(interaction.options.getString('emoji', true));

        return await interaction.reply({content: 'Message added', ephemeral: true});
    }
}