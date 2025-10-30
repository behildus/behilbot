const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder} =require('discord.js');
const { useMainPlayer } = require('discord-player');
const { useQueue, QueryType } = require('discord-player');
const playlists = require('../../mp3/playlists.json');

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function searchFile(dir, fileName) {
    const files = fs.readdirSync(dir);
    //console.log(files);
    // search through the files
    for (const file of files) {
      // build the full path of the file
      const filePath = path.join(dir, file);
  
      // get the file stats
      const fileStat = fs.statSync(filePath);

      // if the file is a directory, recursively search the directory
      if (fileStat.isDirectory()) {
        const fullPath = searchFile(filePath, fileName);
        if (fullPath != undefined) return fullPath;
      } else if (file.endsWith(fileName)) {
        // if the file is a match, print it
        //console.log(filePath);
        return filePath;
      }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlocal')
        .setDescription('Play Local Music!')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Search query or URL.')
                .setRequired(true)
                .addChoices()//...playlists.playlists.map(playlist => ({ name: playlist.title, value: playlist.title})))
        ),
    async execute(interaction) {
        //console.log(playlists);
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        const queue = useQueue(interaction.guild.id);
        if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        const query = await interaction.options.getString('query', true); // we need input/query to play

        const mp3Path = path.join(__dirname, "..", "..", "mp3");
        //const mp3Files = fs.readdirSync(mp3Path).filter(file => file.endsWith('.mp3'));

        var tracks = []

        for (const playlist of playlists.playlists) {
            if (playlist.title == query) {
                tracks = playlist.tracks;
                break;
            }
            //console.log(playlist);
        }
        //console.log(tracks);
        
        shuffle(tracks);

        await interaction.deferReply();{
            if (queue != null) {
                queue.setRepeatMode(0);
                queue.clear();
                queue.node.stop();
            }
            for (const track of tracks) {
                const trackPath = searchFile(mp3Path, track + ".mp3");
                //console.log(trackPath);
                try {
                    await player.play(channel, trackPath, {
                        // in order to play local files, we need to explicitly tell discord-player to search that path in our file system
                    searchEngine: QueryType.FILE // QueryType.FILE tells discord-player to play from our file system,
                    });
                } catch (e) {
                    // let's return error if something failed
                    return interaction.followUp(`Something went wrong: ${e}`);
                }
            }
            interaction.followUp(`**${query}** enqueued!`);
        }
    }
}