const commando = require("@iceprod/discord.js-commando");

module.exports = class Resume extends commando.Command {
    constructor(client) {
        super(client, {
            name: "resume",
            memberName: "resume",
            group: "music",
            description: "Resumes playback"
        });
    }

    async run(msg) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        try {
            if(!msg.guild.music.isPaused()) {
                return msg.channel.send("Playback is already playing. Use `pause` to pause playback.");
            }
            await msg.guild.music.resume();
            msg.channel.send("Resumed");
        } catch(e) {
            console.error(e);

            msg.channel.send("Couldn't resume playback as nothing is playing");
        }
    }
};
