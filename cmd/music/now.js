const commando = require("@iceprod/discord.js-commando");

module.exports = class Now extends commando.Command {
    constructor(client) {
        super(client, {
            name: "now",
            aliases: ["np", "now-playing"],
            memberName: "now",
            group: "music",
            description: "Show current playing song"
        });
    }

    async run(msg) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        var queue = await msg.guild.music.getQueue();

        var selectedId = await msg.guild.music.getPlayingId();

        var selected = queue[selectedId];

        if(selected) {
            try {
                if(msg.guild.music.lastInfo) {
                    await msg.guild.music.lastInfo.delete();
                }
                var m = await msg.channel.send(msg.guild.music.getEmbed(selected, true, selectedId));
                msg.guild.music.lastInfo = m;
                msg.guild.music.channel = msg.channel;
            } catch(e) {
                msg.channel.send("Couldn't fetch song info");
            }
            return;
        }
        msg.channel.send("Nothing playing");
    }
};
