// runs once when client is ready
const { ActivityType, Events, PresenceUpdateStatus } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// set Discord presence
		await client.user.setPresence({
            status: PresenceUpdateStatus.Online,
            activities: [
                {
                    name: "Mickey's Dick Smasher",
                    type: ActivityType.Playing 
                }
            ]
        })

		// get message history from "roles" channel
		const channel = client.channels.cache.find(c => c.name == "roles");
        if (channel) {
            channel.messages.fetch()
        }
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const player = useMainPlayer();
		// debugging stuff
		console.log(player.scanDeps());
		player.on('debug', console.log);
		player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
	},
};
