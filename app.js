const Discord = require('discord.js');
const client = new Discord.Client();
require('ffmpeg-static');
require('opusscript')
const token = require("./token")


const settings = {
    prefix: '*',
    token: token
};


const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false, // This options are optional.
});
client.player = player;


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async(message) => {
    
    if (!message.guild) return;
  
    if (message.content === 'pleaseJ') {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }
  });

  


client.player.on('songAdd',  (message, queue, song) =>
    message.channel.send(`**${song.name}** has been added to the queue!`))
    .on('songFirst',  (message, song) =>
        message.channel.send(`**${song.name}** is now playing!`));

client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if(command === 'play'){
        let song = await client.player.play(message, args.join(' '));
        
        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if(song)
            console.log(`Playing ${song.name}`);
        return;
    }
    
    // OR with the Options Object
    if(command === 'play'){
        let song = await client.player.play(message, {
            search: args.join(' '),
            requestedBy: message.author.tag
        });

        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if(song)
            console.log(`Playing ${song.name}`);
        return;
    }
});

//pause a song
client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'pause'){
        let song = client.player.pause(message);
        if(song) 
            message.channel.send(`${song.name} was paused!`);
    }
});

//resume a song
client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'resume'){
        let song = client.player.resume(message);
        if(song) 
            message.channel.send(`${song.name} is resumed!`);
    }
});

//skip the song in the queue
client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'skip'){
        let song = client.player.skip(message);
        if(song)
            message.channel.send(`${song.name} was skipped!`);
    }
});

client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // !remove 2

    if(command === 'remove'){
        let SongID = parseInt(args[0])-1; // The index is starting from 0, so we subtract 1.
        
        // Removes a song from the queue
        let song = client.player.remove(message, SongID);
        if(song)
            message.channel.send(`Removed song ${song.name} (${args[0]}) from the Queue!`);
    }
});

// to shuffle the songs in the queue
client.on('message', (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'shuffle'){
        let songs = client.player.shuffle(message);
        if(songs)
            message.channel.send('Server Queue was shuffled.');
    }
});


//To add songs in the queue
client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'queue'){
        let queue = client.player.getQueue(message);
        if(queue)
            message.channel.send('Queue:\n'+(queue.songs.map((song, i) => {
                return `${i === 0 ? 'Now Playing' : `#${i+1}`} - ${song.name} | ${song.author}`
            }).join('\n')));
    }
    
});

client.login(token);
