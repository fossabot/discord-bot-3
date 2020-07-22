const commando = require("@iceprod/discord.js-commando");
const pool = require("../../managers/pool_mysql");

module.exports = class Unsubscribe extends commando.Command {
    constructor(client) {
        super(client, {
            name: "unsubscribe",
            memberName: "unsubscribe",
            group: "mod",
            description: "Unsubscribes given guild/channel.",
            permissions: ["ADMINISTRATOR"],
            guildOnly: true,
            args: [
                {
                    type: "string",
                    validate(val) {
                        return !Number.isNaN(BigInt(val));
                    },
                    key: "channel",
                    prompt: "what is the channel ID of that guild to unsubscribe from?"
                }
            ]
        });
    }

    async run(msg, { channel }) {
        var [deleted] = await pool.query("DELETE FROM subscriptions WHERE target=? AND channel=? AND target_channel=?",
            [msg.guild.id, channel, msg.channel.id]);
        if(deleted.affectedRows) {
            var channelName = "Channel " + channel;
            try {
                channelName = (await this.client.channels.fetch(channel)).name;
            } catch(e) {}
            msg.channel.send(`**${msg.member.displayName}** has removed **${channelName}** from this channel. It's message will be no longer sent here.`);
        } else {
            msg.channel.send("This channel wasn't subscribed to that channel. Did you copy the correct ID?");
        }
    }
};
