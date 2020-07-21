const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Logs extends commando.Command {
    constructor(client) {
        super(client, {
            name: "log",
            memberName: "log",
            aliases: ["logs"],
            group: "mod",
            description: "Log settings. See `help` subcommand for more info. When altering, use +option to add, -option to remove and !option to toggle log options",
            hidden: true,
            guildOnly: true,
            args: [
                {
                    type: "string",
                    oneOf: ["set", "add", "remove", "alter", "view", "list", "help"],
                    key: "command",
                    prompt: "Which action to do?"
                }, {
                    type: "channel",
                    key: "channel",
                    prompt: "Which channel to add/remove?",
                    isEmpty: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return false;
                        if(!val) return true;
                        return val.length === 0;
                    },
                    validate: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return true;
                        if(!val) return false;
                        return !!val.match(/<#[0-9]+>/);
                    },
                    parse: (val, msg) => {
                        if(msg.content.indexOf("list") !== -1) return "";
                        var id = val.match(/<#([0-9]+)>/);
                        return msg.guild.channels.resolve(id[1]);
                    }
                }, {
                    type: "string",
                    key: "settings",
                    prompt: "",
                    default: ""
                }
            ]
        });
    }

    async run(msg, { command, channel, settings }) {
        const allowedOptions = [
            "*",
            "*.*",
            "user.*",
            "channel.*",
            "category.*",
            "message.*",
            "guild.*",
            "roles.*",
            "config.*",
            "emoji.*",
            "invite.*",

            "user.join",
            "user.leave",
            "user.update",
            "user.presenceUpdate",

            "channel.create",
            "channel.delete",
            "channel.pins",
            "channel.update",
            "channel.name",

            "category.create",
            "category.delete",
            "category.perms",
            "category.name",

            "guild.update",
            // "guild.options",
            "guild.ban",
            "guild.removeBan",
            "guild.integration",
            "guild.kick",
            "guild.warn",
            "guild.webhook",

            "roles.create",
            "roles.update",

            "config.logs",
            "config.allowedChannels",
            "config.commands",

            "message.withLink",
            "message.withInvite",
            "message.edit",
            "message.delete",
            "message.purge",

            "emoji.create",
            "emoji.delete",
            "emoji.update",

            "invite.create",
            "invite.delete"
        ];
        var chs = await this.getLogs(msg);
        for(const ch of chs) {
            if(!ch.settings.length || !msg.guild.channels.resolve(ch.id)) {
                await this.alterLogsChannel(msg, ch.id, {
                    ...ch,
                    deleted: true
                });
            }
        }
        /* eslint-disable no-redeclare */
        switch(command) {
            case "help":
                var embed = newEmbed();
                embed.setTitle("Logs");
                embed.setDescription("For more info about how logs settings work, click the title.");
                embed.setURL("http://aztec.danbulant.eu/wiki/doku.php?id=help:logs");
                msg.channel.send(embed);
                break;
            case "list":
                var channels = chs;
                var embed = newEmbed();
                embed.setTitle("Logging channels:");
                embed.setDescription("Found " + channels.length + " channels to log into:");
                for(var channel of channels) {
                    var ch = msg.guild.channels.resolve(channel.id);
                    embed.addField("**#" + ch.name + "**", channel.settings.join());
                }
                msg.channel.send(embed);
                break;

            case "add":
            case "set":
                var channels = await this.addLogsChannel(msg, {
                    settings: ["*"],
                    id: channel.id
                });
                msg.channel.send("New channel added with default settings");
                break;

            case "remove":
                if(await this.removeLogsChannel(msg, channel.id)) {
                    msg.channel.send("Removed the channel");
                } else {
                    msg.channel.send("Channel doesn't exist");
                }
                break;

            case "alter":
                var ch = await this.getLogsChannel(msg, channel.id);
                if(!ch) return msg.channel.send("The channel is not set as logging channel!");

                for(var option of settings.split(" ")) {
                    switch(option[0]) {
                        case "+":
                            if(!ch.settings.includes(option.substr(1))) {
                                ch.settings.push(option.substr(1));
                            }
                            break;
                        case "-":
                            if(ch.settings.includes(option.substr(1))) {
                                ch.settings = ch.settings.filter(c => c !== option.substr(1));
                            }
                            break;
                        case "!":
                            if(ch.settings.includes(option.substr(1))) {
                                ch.settings = ch.settings.filter(c => c !== option.substr(1));
                            } else {
                                ch.settings.push(option.substr(1));
                            }
                            break;
                        default:
                            msg.channel.send("Unknown operation with option " + option + ", ignoring");
                    }
                }

                ch.settings = ch.settings.filter(c => allowedOptions.includes(c));

                var altered = await this.alterLogsChannel(msg, channel.id, {
                    settings: ch.settings,
                    id: channel.id
                });
                if(altered) {
                    msg.channel.send("Altered the channel");
                } else {
                    msg.channel.send("Couldn't alter the channel");
                }
                break;

            case "view":
                var embed = newEmbed();
                embed.setTitle("Logging channel `#" + channel.name + "`");
                var ch = await this.getLogsChannel(msg, channel.id, chs);
                if(!ch) {
                    embed.setDescription("The channel <#" + channel.id + "> is not setup as channel for logs!");
                } else {
                    embed.setDescription(ch.settings.join());
                }
                msg.channel.send(embed);
                break;
        }
        /* eslint-enable no-redeclare */
    }

    /**
     * Returns array of channels that can be used
     * @param {Message} msg Message to get channels from
     * @param {Boolean} deleted return deleted?
     */
    async getLogs(msg, deleted = false) {
        var settings = msg.guild.settings;
        var sets = {
            * [Symbol.iterator]() {
                var i = 0;
                while(await settings.get("logs.channels." + i, null)) {
                    var value = await settings.get("logs.channels." + i);
                    if(value.deleted && !deleted) {
                        i++;
                        continue;
                    }
                    yield value;
                    i++;
                }
            }
        };
        var logs = [];
        for(var set of sets) {
            logs.push(set);
        }

        return logs;
    }

    async getLogsChannel(msg, id, chs) {
        var logs = chs || await this.getLogs(msg);
        return logs.filter(c => c.id === id)[0];
    }

    async addLogsChannel(msg, data, chs) {
        if(await this.alterLogsChannel(msg, data.id, { ...data, deleted: false })) {
            return true;
        }
        if(await this.getLogsChannel(msg, data.id)) {
            return false;
        }
        var length = (chs || await this.getLogs(msg)).length;
        msg.guild.settings.set("logs.channels." + length, data);
    }

    removeLogsChannel(msg, id, chs) {
        return this.alterLogsChannel(msg, id, { deleted: true }, chs);
    }

    async alterLogsChannel(msg, id, data, chs) {
        var logs = chs || await this.getLogs(ms);
        for(const logID in logs) {
            const log = logs[logID];
            if(log.id === id) {
                logs[logID] = {
                    ...log,
                    ...data
                };
                await msg.guild.settings.set("logs.channels." + logID, logs[logID]);
                return true;
            }
        }
        return false;
    }
};
