const commando = require("@iceprod/discord.js-commando");

module.exports = class Shuffle extends commando.Command {
    constructor(client) {
        super(client, {
            name: "shuffle",
            memberName: "shuffle",
            group: "music",
            description: "Shuffles the queue"
        });
    }

    async run(msg) {
        if(!await msg.guild.isPremium()) {
            return msg.channel.send("This guild is not boosted yet. Use `boost` command to boost this server for perks like music and more.");
        }
        var queue = await msg.guild.music.getQueue();
        var id = await msg.guild.music.getPlayingId();

        if(id > -1) {
            queue[id].current = id;
        }
        queue = msg.guild.music.shuffleArray(queue);

        if(id > -1) {
            // current one needs to be at same place
            var news = queue.findIndex(val => typeof val.current === "number");
            [queue[id], queue[news]] = [queue[news], queue[id]];
        }

        await msg.guild.settings.set("music.queue", queue);
        msg.channel.send("Shuffled  " + queue.length + " song" + (queue.length > 1 ? "s" : "") + " in queue.");
    }
};
