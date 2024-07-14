const { SlashCommandBuilder} =require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips current song'),
    async execute(interaction) {

        const queue = useQueue(interaction.guild.id);

        queue.node.skip();

        await interaction.deferReply();
        try {
            return interaction.followUp(`Skipping`);
        } catch {
            return interaction.followUp(`Something went wrong: ${e}`);
        }

    }

}
