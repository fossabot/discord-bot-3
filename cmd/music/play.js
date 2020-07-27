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
                    prompt: "What music to add?"
                }
            ]
        });
    }

    async run(msg, { url }) {
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
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
            await msg.guild.music.play(msg, url);
        } catch(e) {
            console.log(e);
            this.client.emit("commandError", this, e, msg);
            msg.channel.send("Something went wrong.");
        }
    }
};
