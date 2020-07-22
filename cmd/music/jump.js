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
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
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
