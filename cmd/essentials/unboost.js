const commando = require("@iceprod/discord.js-commando");
const pool = require("../../managers/pool_mysql");

module.exports = class Unboost extends commando.Command {
    constructor(client) {
        super(client, {
            name: "unboost",
            memberName: "unboost",
            group: "essentials",
            description: "Unboosts server",
            guildOnly: true,
            args: []
        });
    }

    async run(msg) {
        var dbuser = await msg.author.fetchUser();
        if(!dbuser.donor_tier) {
            return msg.channel.send("Only premium users can boost servers.");
        }

        var [res] = await pool.query("DELETE FROM boosts WHERE user = ? AND guild = ?", [dbuser.db_id, msg.guild.id]);

        if(res.affectedRows) {   
            msg.channel.send("Boost removed!");
        } else {
            msg.channel.send("You did not boost this guild");
        }
    }
};
