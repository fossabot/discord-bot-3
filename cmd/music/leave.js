const commando = require("@iceprod/discord.js-commando");

module.exports = class Leave extends commando.Command {
    constructor(client) {
        super(client, {
            name: "leave",
            memberName: "leave",
            group: "music",
            description: "Leaves the voice channel."
        });
    }

    /**
     * @param {Commando.Message} msg
     */
    async run(msg) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        if(!msg.guild.voice) {
            msg.channel.send("The bot isn't in a voice channel!");
            return;
        }
        try {
            await msg.guild.voice.channel.leave();
            if(msg.guild.voice.connection) {
                msg.guild.voice.connection.disconnect();
            }
            msg.channel.send("Done!");
        } catch(e) {
            msg.channel.send("Something went wrong");
        }
    }
};
