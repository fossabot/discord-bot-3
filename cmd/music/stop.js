const commando = require("@iceprod/discord.js-commando");

module.exports = class Stop extends commando.Command {
    constructor(client) {
        super(client, {
            name: "stop",
            memberName: "stop",
            group: "music",
            description: "Stops the music player"
        });
    }

    async run(msg) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        var queue = await msg.guild.music.getQueue(msg.guild);

        var selected = await msg.guild.music.getPlaying(msg.guild);

        if(selected > -1 && selected < queue.length) {
            await msg.guild.music.setPlaying(msg.guild, -1);
            return msg.channel.send("Stopped music playback.");
        }
        msg.channel.send("Nothing playing");
    }
};
