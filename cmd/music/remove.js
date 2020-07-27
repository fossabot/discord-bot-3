const commando = require("@iceprod/discord.js-commando");

module.exports = class Remove extends commando.Command {
    constructor(client) {
        super(client, {
            name: "remove",
            memberName: "remove",
            group: "music",
            description: "Remove song from queue",

            args: [
                {
                    key: "selected",
                    type: "integer",
                    prompt: "Which song to remove from queue?"
                }, {
                    key: "length",
                    default: 1,
                    type: "integer",
                    prompt: "How many songs to delete?"
                }
            ]
        });
    }

    async run(msg, { selected, length }) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        var queue = await msg.guild.music.getQueue();

        queue.splice(selected, length);

        await msg.guild.settings.set("music.queue", queue);

        var npid = await msg.guild.music.getPlayingId();
        if(selected < npid) {
            await msg.guild.settings.set("music.playing", npid - length);
        }

        msg.channel.send("Removed " + length + " song" + (length > 1 ? "s" : "") + " from queue.");
    }
};
