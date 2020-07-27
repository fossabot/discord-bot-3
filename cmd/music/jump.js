const commando = require("@iceprod/discord.js-commando");

module.exports = class Jump extends commando.Command {
    constructor(client) {
        super(client, {
            name: "jump",
            memberName: "jump",
            group: "music",
            description: "Jumps to selected position in queue",

            args: [
                {
                    type: "integer",
                    key: "number",
                    prompt: "To which position in queue to jump to?"
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
            await msg.guild.music.jump(number - 1);
            msg.guild.music.channel = msg.channel;
            msg.channel.send("Jumped to position " + number + ".");
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
