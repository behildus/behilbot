const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const schedule = require('../../mp3/schedule.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Replies with Pong!')
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('DMM:SS')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('Message to send')
                .setRequired(true)
        ),
	async execute(interaction) {
        schedule.messages.push({
            "time": interaction.options.getString('time', true),
            "server": interaction.guild.id,
            "channel": interaction.channel.id,
            "text": interaction.options.getString('text', true),
            //"emoji": ["full_moon", "sunny"]
        });

        console.log(JSON.stringify(schedule));

        fs.writeFileSync('mp3/schedule.json', JSON.stringify(schedule));

        return interaction.reply(`Message Scheduled`);
	},
};
