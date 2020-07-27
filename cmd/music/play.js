const commando = require("@iceprod/discord.js-commando");

module.exports = class Play extends commando.Command {
    constructor(client) {
        super(client, {
            name: "play",
            memberName: "play",
            group: "music",
            description: "Add given music into queue",

            args: [
                {
                    key: "url",
                    type: "string",
                    prompt: "What music to add?",
                    default: ""
                }
            ]
        });
    }

    async run(msg, { url }) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        if(!msg.member.voice || !msg.member.voice.channel) {
            msg.channel.send("You're not in a voice channel!");
            return;
        }
        if(!msg.guild.voice) {
            try {
                await msg.member.voice.channel.join();
                msg.channel.send("Joined voice channel.");
            } catch(e) {
                return msg.channel.send("Couldn't join your voice channel. Make sure the bot has permission to join");
            }
        }
        if(!msg.guild.voice.connection) {
            try {
                await msg.guild.voice.channel.join();
            } catch(e) {
                await msg.member.voice.channel.join();
            }
        }
        try {
            if(msg.guild.music.isPaused()) {
                await msg.guild.music.resume();
                msg.channel.send("Resumed");
                if(!url) return;
            }
        } catch(e) {}
        try {
            if(url) {
                await msg.guild.music.play(msg, url);
            } else {
                var queue = await msg.guild.music.getQueue();
                if(!queue.length) {
                    return msg.channel.send("Nothing to play.");
                }
                var current = await msg.guild.music.getPlayingId();
                if(current >= queue.lengt) {
                    await msg.guild.music.setPlaying(0);
                }
                await msg.guild.music.startPlaying();
                msg.channel.send("Playing some tunes");
            }
        } catch(e) {
            console.log(e);
            this.client.emit("commandError", this, e, msg);
            msg.channel.send("Something went wrong.");
        }
    }
};
