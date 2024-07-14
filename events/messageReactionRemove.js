const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionRemove,
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
        await reaction.message.guild.members.fetch();
        const member = await reaction.message.guild.members.cache.find(m => m.id == user.id);
        for (let i = 1; i < messageArray.length; i++) {
            const roleArray = messageArray[i].split(": ");
            if (reaction.emoji.name ==roleArray[1]) {
                const role = await reaction.message.guild.roles.cache.find(r => r.name == roleArray[0]);
                await member.roles.remove(role);
                return;
            }
        } 
    }
}
