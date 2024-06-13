const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Disconnects Bot'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        const queue = useQueue(interaction.guild.id);

        if (!queue.deleted) {
            queue.setRepeatMode(0);
            queue.clear();
            queue.node.stop();
            return interaction.replay(`Stopped music and cleared queue`);
        }
    }
}