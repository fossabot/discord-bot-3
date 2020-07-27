const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const pages = require("../../managers/pages");

module.exports = class Queue extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            memberName: "queue",
            group: "music",
            description: "List current queue",

            args: [
                {
                    key: "selected",
                    default: 0,
                    type: "integer",
                    prompt: "Which song to get info about?"
                }
            ]
        });
    }

    async run(msg, { selected }) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        var queue = await msg.guild.music.getQueue();

        var embed = newEmbed();
        embed.setTitle(`Current queue (${queue.length} song${queue.length === 1 ? "" : "s"})`);
        embed.addField("Queue", "loading...");

        if(!queue.length) {
            embed.fields = [];
            embed.setDescription("Queue is empty");
            return await msg.channel.send(embed);
        }

        if(selected > 0 && selected <= queue.length) {
            return await msg.channel.send(msg.guild.music.getEmbed(queue[selected - 1], false, selected));
        }

        var me = await msg.channel.send(embed);

        await pages(msg, embed, me, queue, 1, "music in queue", song => `${song.data.title} (Requested by <@!${song.requested}>)`);
    }
};
