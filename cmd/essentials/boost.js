const commando = require("@iceprod/discord.js-commando");
const pool = require("../../managers/pool_mysql");

module.exports = class Boost extends commando.Command {
    constructor(client) {
        super(client, {
            name: "boost",
            memberName: "boost",
            group: "essentials",
            description: "Boosts current guild.",
            guildOnly: true,
            args: []
        });
    }

    async run(msg) {
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("Only premium users can boost servers.");
        }

        const limit = [0, 1, 3][dbuser.donor_tier];

        var [res] = await pool.query("SELECT SUM(levels) AS level FROM boosts WHERE user = ?", [dbuser.db_id]);

        if(res[0] && res[0].level >= limit) {
            return msg.channel.send("You cannot boost any more servers.");
        }

        await pool.query("INSERT INTO boosts (user, guild, levels) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE levels = levels + 1", [dbuser.db_id, msg.guild.id]);

        msg.channel.send("Boosted!");
    }
};
