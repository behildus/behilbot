const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }
        if (reaction.message.channel.name != "roles") return;

        const message = reaction.message.content;
        const messageArray = message.split('\n');

        const member = reaction.message.guild.members.cache.get(user.id);
        for (let i = 1; i < messageArray.length; i++) {
            const roleArray = messageArray[i].split(": ");
            if (reaction.emoji.name ==roleArray[1]) {
                const role = await reaction.message.guild.roles.cache.find(r => r.name == roleArray[0]);
                await member.roles.add(role);
                return;
            }
        }
    }
}