// require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, Partials, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
require('dotenv/config');

// create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
})
// create player instance and load extractors
const player = new Player(client);
player.extractors.loadDefault();

// search command directory to set commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// search event directory to set events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file2 => file2.endsWith('.js'));

for (const file2 of eventFiles) {
	const filePath2 = path.join(eventsPath, file2);
	const event = require(filePath2);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// this event is emitted whenever discord-player starts to play a track
player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    //queue.metadata.channel.send(`Started playing ***!`);
});

// log in to Discord with the client's token
client.login(process.env.TOKEN);
