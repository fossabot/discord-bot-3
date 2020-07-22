const commando = require("@iceprod/discord.js-commando");
const pool = require("../../managers/pool_mysql");

module.exports = class Subscribe extends commando.Command {
    constructor(client) {
        super(client, {
            name: "subscribe",
            memberName: "subscribe",
            group: "mod",
            description: "Subscribes to channel",
            permissions: ["ADMINISTRATOR"],
            guildOnly: true,
            args: [
                {
                    type: "string",
                    validate(val) {
                        return !Number.isNaN(BigInt(val));
                    },
                    key: "channel",
                    prompt: "what is the channel ID of that guild to subscribe to?"
                }
            ]
        });
    }

    async run(omsg, { channel }) {
        var msg = await omsg.channel.send("Subscribing...");
        var ch = await this.client.channels.fetch(channel);
        if(!ch) {
            return msg.edit("Couldn't find that channel. Check that the ID is correct.");
        }

        var target = msg.guild.id;
        var targetChannel = msg.channel.id;
        var guild = ch.guild;

        if(!guild) {
            return msg.edit("Selected channel is not in any server");
        }

        var [channels] = await pool.query("SELECT * FROM subscription_channels WHERE guild=?", [guild]);

        if(~channels.findIndex(val => val.channel === channel)) {
            return msg.edit("Only the following channels are available to subscription from that server:\n" +
                channels.map(val => "<#" + val.channel + "> (" + val.channel + ")").join());
        }

        var [subscribed] = await pool.query("SELECT * FROM subscriptions WHERE guild=? AND target=? AND channel=? AND target_channel=?",
            [guild, target, channel, targetChannel]);

        if(subscribed.length) {
            return msg.edit("You already subscribed that channel here.");
        }

        var [subscribable] = await pool.query("SELECT * FROM subscription_channels WHERE guild=? AND channel=?", [target, targetChannel]);
        if(subscribable.length) {
            return msg.edit("Cannot subscribe to subscribeable channel. Remove subscription option first.");
        }

        try {
            await pool.query("INSERT INTO subscriptions (guild, channel, target, target_channel) VALUES (?,?,?,?)",
                [guild, channel, target, targetChannel]);

            msg.edit(`**${omsg.member.displayName}** has added **${ch.name}** to this channel. It's most important updates will show up here.`);
        } catch(e) {
            console.log("[ERROR]", e);
            this.client.emit("commandError", this, e, msg);
            msg.edit("Couldn't add that channel here. Contact TechmandanCZ#0135 for more information.");
        }
    }
};
