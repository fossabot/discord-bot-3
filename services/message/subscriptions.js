const pool = require("../../managers/pool_mysql");
const Service = require("../base");

var available = true;

module.exports = class SubscriptionPropagatorService extends Service {
    name = "subscriptionpropagator";
    load() {
        this.client.on("message", async msg => {
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
        });
    }
};
