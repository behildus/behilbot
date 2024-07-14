const { ActivityType, Events, PresenceUpdateStatus } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const player = useMainPlayer();
        await player.extractors.loadDefault();

		await client.user.setPresence({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    name: "Mickey's Dick Smasher",
                    type: ActivityType.Playing 
                }
            ]
        })

		const channel = client.channels.cache.find(c => c.name == "roles");
        if (channel) {
            channel.messages.fetch()
        }
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
