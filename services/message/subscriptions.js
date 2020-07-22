const pool = require("../../managers/pool_mysql");

var available = true;

module.exports = async msg => {
    if(!msg.guild) return;
    if(!available) return;

    if(msg.author.id === msg.client.user.id) return; // don't propagate bots messages

    try {
        var [channels] = await pool.query("SELECT * FROM subscriptions WHERE channel=? AND guild=?", [msg.channel.id, msg.guild.id]);
    } catch(e) {
        available = false;
        console.log("[SUBSCRIPTIONS] Error - Coudln't fetch channels:", e);
        return;
    }

    for(var channel of channels) {
        try {
            var ch = await msg.client.channels.fetch(channel.target_channel);
            ch.send(msg);
        } catch(e) {
            console.error("[SUBSCRIPTION-SEND] Couldn't send to " + channel.target_channel, e);
        }
    }
};
