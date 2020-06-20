const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

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
        var dbuser = await account.fetchUser(msg.author.id);
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
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
            console.log(e);

            msg.channel.send("Couldn't resume playback as nothing is playing");
        }
    }
};
