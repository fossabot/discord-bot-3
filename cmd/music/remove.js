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
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
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
