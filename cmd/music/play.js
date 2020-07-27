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
        if(!msg.guild.voice) {
            if(!msg.member.voice) {
                msg.channel.send("You're not in a voice channel!");
                return;
            }
            try {
                await msg.member.voice.channel.join();
                msg.channel.send("Joined voice channel.");
            } catch(e) {
                return msg.channel.send("Couldn't join your voice channel. Make sure the bot has permission to join");
            }
        }
        try {
            if(url) {
                await msg.guild.music.play(msg, url);
            } else {
                await msg.guild.music.skip(0);
            }
        } catch(e) {
            console.log(e);
            this.client.emit("commandError", this, e, msg);
            msg.channel.send("Something went wrong.");
        }
    }
};
