const commando = require("@iceprod/discord.js-commando");
const account = require("../../managers/accountManager");

module.exports = class Volume extends commando.Command {
    constructor(client) {
        super(client, {
            name: "volume",
            aliases: ["vol"],
            memberName: "volume",
            group: "music",
            description: "Sets music volume",

            args: [
                {
                    type: "integer",
                    default: -1,
                    key: "volume",
                    prompt: "What to set the new volume to?"
                }
            ]
        });
    }

    async run(msg, { volume }) {
        var dbuser = await account.fetchUser(msg.author.id);
        if(!dbuser.donor_tier) {
            return msg.channel.send("You can't use this command as you don't have premium");
        }
        if(volume > 0) {
            if(volume > 150) {
                return msg.channel.send("You can't set volume more than 150%");
            }
            await msg.guild.music.setVolume(volume / 100);
            msg.channel.send("Set volume to " + volume + "%.");

            try {
                var queue = await msg.guild.music.getQueue();
                var selectedId = await msg.guild.music.getPlayingId();
                var selected = queue[selectedId];

                if(msg.guild.music.lastInfo) {
                    await msg.guild.music.lastInfo.delete();
                }
                var m = await msg.channel.send(msg.guild.music.getEmbed(selected, true, selectedId));
                msg.guild.music.lastInfo = m;
                msg.guild.music.channel = msg.channel;
            } catch(e) {}
        } else {
            msg.channel.send(`Current volume is ${await msg.guild.music.getVolume()}`);
        }
    }
};
