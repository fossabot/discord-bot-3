const commando = require("@iceprod/discord.js-commando");

module.exports = class Skip extends commando.Command {
    constructor(client) {
        super(client, {
            name: "skip",
            memberName: "skip",
            group: "music",
            description: "Skips currently playing song(s)",

            args: [
                {
                    type: "integer",
                    key: "number",
                    prompt: "How many songs to skip?",
                    default: 1
                }
            ]
        });
    }

    async run(msg, { number }) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        if(!msg.guild.voice) {
            return msg.channel.send("Bot is not connected to a voice channel. Join a music channel and invoke `join` command");
        }
        try {
            await msg.guild.music.skip(number);
            msg.guild.music.channel = msg.channel;
            msg.channel.send("Skipped " + number + " songs.");
        } catch(e) {
            console.error(e);
            if(e.message === "range") {
                msg.channel.send("The number of songs selected is out of limits.");
            } else {
                msg.channel.send("Unexpected error occured. Current bot timestamp: " + new Date());
            }
        }
    }
};
