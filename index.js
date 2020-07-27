const Commando = require("@iceprod/discord.js-commando");
const path = require("path");
const sl = require("singleline");
const config = require("./config.json");
const Snoowrap = require("snoowrap");
const requireAll = require("require-all");
const ServiceEnabledRegistry = require("./services/registry");
const Dispatcher = require("@iceprod/discord.js-commando/src/dispatcher");
// eslint-disable-next-line no-unused-vars
require("colors");
const { shortNumber } = require("./utils");

var dbl;

require("./structures/");

function requireDirectory(directory) {
    return Object.values(requireAll({
        dirname: require("path").join(__dirname, directory)
    }));
}

const inhibitors = requireDirectory("./services/inhibitors");

const client = new Commando.Client({
    owner: ["147365975707090944", "236504705428094976"],
    commandPrefix: "aztec ",
    invite: "<https://discord.gg/8fqEepV>",
    messageCacheMaxSize: 50, // max 50 messages per channel
    messageCacheLifetime: 180, // cache last 3 minutes of messages
    messageSweepInterval: 30
});

client.registry = new ServiceEnabledRegistry(client);
client.dispatcher = new Dispatcher(client, client.registry);

client.removeAllListeners("message");
client.removeAllListeners("messageUpdate");

client.on("message", message => { client.dispatcher.handleMessage(message).catch(err => { client.emit("error", err); }); });
client.on("messageUpdate", (oldMessage, newMessage) => {
    client.dispatcher.handleMessage(newMessage, oldMessage).catch(err => { this.emit("error", err); });
});

if(config.dbl) {
    const DBL = require("dblapi.js");
    dbl = new DBL(config.dbl, client);
    global.dbl = dbl;

    // Optional events
    dbl.on("posted", () => {
        console.log("[DBL] Updated count!");
    });

    dbl.on("error", e => {
        console.log(`[DBL] Error: ${e}`);
    });
} else {
    console.log("[DBL] Skipping DBL API integration as no token is present in config.\nAll users will seem to have voted on the bot (even if in fact didn't).");
}

require("./services/logging/registerEvents")(client);
require("./services/server")(client);

const MysqlProvider = require("./services/mysqlProvider");
client.setProvider(
    new MysqlProvider(require("./managers/pool_mysql"))
    // sqlite.open(path.join(__dirname, "settings.sqlite3")).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.config = config;

{
    const loadedCommands = new Map();

    client.on("commandRegister", c => {
        loadedCommands.set(c.name, c);
    });

    client.on("ready", async () => {
        var groups = new Map();
        for(const [, command] of loadedCommands) {
            groups.set(command.group, groups.get(command.group) + 1 || 1);
        }
        groups = new Map([...groups].sort((a, b) => {
            return (a[1] > b[1] && -1) || (a[1] === b[1] ? 0 : 1);
        }));
        for(const [group, length] of groups) {
            console.log(`[LOAD] Found ${length.toString().padStart(2, " ").bold} commands in ${group.id.toString().cyan}`);
        }

        const ready = [
            "╭─────────────────────────────────────────────╮",
            "│ ┌─────╮ ┌─────╮ ╭──────╮ ┌──────╮ ┌──┐ ┌──┐ │",
            "│ │ ╭─╮ │ │ ╭───╯ │ ╭──╮ │ │ ┌──╮ │ │  │ │  │ │",
            "│ │ ╰─╯ │ │ ╰──╮  │ ╰──╯ │ │ │  │ │ │  ╰─╯  │ │",
            "│ │    ─┤ │ ╭──╯  │ ╭──╮ │ │ │  │ │ ╰──╮ ╭──╯ │",
            "│ │ ├─╮ │ │ ╰───╮ │ │  │ │ │ └──╯ │    │ │    │",
            "│ └─╯ ╰─╯ └─────╯ └─┘  └─┘ └──────╯    └─┘    │",
            "╰─────────────────────────────────────────────╯"
        ];
        console.log("[EVENT] The bot is now");
        for(const str of ready) {
            console.log(str.green);
        }
    });
}

(async () => {
    try {
        if(!config.reddit) {
            throw new Error("Reddit configuration is missing");
        }
        const redditConfig = {
            user_agent: "Ice Bot",
            client_id: config.reddit.id,
            client_secret: config.reddit.secret,
            username: config.reddit.username,
            password: config.reddit.password
        };

        const r = await new Snoowrap(redditConfig);
        // eslint-disable-next-line no-unused-expressions
        (await r.getSubreddit("announcements")).user_flair_background_color;
        console.log("[REDDIT] Reddit connection successful");

        global.reddit = r;

        module.exports.reddit = r;
    } catch(e) {
        if(!e.error) {
            console.log("[ERROR] Unexpected error happened:", e);
        } else {
            console.error(`[REDDIT] Reddit connection not successful, error:\n${e.error.error}, ${e.error.message}`);
            if(e.error.error === 401) {
                console.error(sl(`[REDDIT]
                This probably means, that some values in your config are wrong, and therefore the bot cannot access Reddit.
                Please contact the original creators of this bot if you're absolutely sure that you set it up correctly.
                `));
            }
        }
    } finally {
        client.registry.registerGroups([
            ["special", "Owner-only"],
            ["anime", "Anime"],
            ["balance", "Balance"],
            ["dev", "for Developers"],
            ["essentials", "Essentials"],
            ["fun", "Fun"],
            ["games", "Games"],
            ["image", "Image management"],
            ["mod", "Moderation"],
            ["music", "Music"],
            ["nsfw", "NSFW"],
            ["tickets", "Tickets"]
        ])
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                eval: false,
                help: false
            })
            .registerTypesIn(path.join(__dirname, "types"))
            .registerCommandsIn(path.join(__dirname, "cmd"))
            .registerServicesIn(path.join(__dirname, "services/message"));
    }
})();

client.on("commandRun", (c, p, msg) => {
    var message = `[USE] \u001b[35;1m[${msg.channel.type === "dm" ? "DM" : msg.guild.name} (${msg.guild ? msg.guild.id : 0})] \u001b[37;1m(${msg.author.tag} [${msg.author.id}])\u001b[0m -> `;
    var content = msg.content;
    if(!msg.content.startsWith(`<@${msg.client.user.id}>`) && !msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
        if(msg.guild) {
            content = msg.content.substr(msg.guild.commandPrefix.length || msg.client.commandPrefix.length);
            message += `\u001b[4m${msg.guild.commandPrefix || msg.client.commandPrefix}\u001b[0m`;
        }
    } else {
        if(msg.content.startsWith(`<@${msg.client.user.id}>`)) {
            content = content.substr(`<@${msg.client.user.id}>`.length);
            message += `\u001b[4m<@${msg.client.user.id}>\u001b[0m`;
        } else {
            content = content.substr(`<@!${msg.client.user.id}>`.length);
            message += `\u001b[4m<@!${msg.client.user.id}>\u001b[0m`;
        }
    }
    if(msg.alias) {
        content = content.replace(msg.alias, `\u001b[7m${msg.alias}\u001b[0m`);
    }
    message += content;

    console.log(message);
    msg.author.sendAchievementUnique(msg, "new");
    if(msg.author.discriminator === "0135") {
        msg.author.sendAchievementUnique(msg, "identify");
    }
});

for(var inhibitor of inhibitors) {
    client.dispatcher.addInhibitor(inhibitor);
}

async function statusUpdate() {
    const activity = await client.provider.get("global", "status");
    if(!activity) return;
    const name = activity.name;
    if(!name.match(/\{\{[\w.]*?\}\}/g)) return;

    var users = 0;
    var guilds = 0;
    for(const guild of client.guilds.cache) {
        guilds++;
        users += guild[1].memberCount;
    }
    var vars = {
        users: users,
        guilds: guilds,
        servers: guilds
    };

    name.replace(/(?<=\{\{)[\w.]*?(?=\}\})/gi, m => {
        m = m.toLowerCase();
        if(!vars[m]) return m;
        return shortNumber(vars[m]);
    }).replace(/[{}]/g, "");

    const status = {
        name: name,
        type: activity.type
    };

    client.user.setActivity(status.name, { type: status.type });
}

client.on("guildCreate", () => {
    statusUpdate();
});
client.on("guildDelete", () => {
    statusUpdate();
});

client.login(config.token);

client.once("ready", async () => {
    statusUpdate();
    if(config.channel) {
        (async () => {
            try {
                var ch = await client.channels.fetch(config.channel);
            } catch(e) {
                return console.warn("Couldn't fetch log channel".yellow);
            }

            client.on("guildCreate", g => {
                ch.send({
                    embed: {
                        title: "New guild - " + g.name,
                        description: "Members: " + g.memberCount,
                        footer: {
                            text: g.owner ? g.owner.displayName : g.ownerID
                        }
                    }
                });
            });

            client.on("guildDelete", g => {
                ch.send({
                    embed: {
                        title: "Guild removed - " + g.name,
                        description: "Members: " + g.memberCount,
                        footer: {
                            text: g.owner ? g.owner.displayName : g.ownerID
                        }
                    }
                });
            });

            client.on("error", error => {
                console.log(error);
                ch.send({
                    embed: {
                        title: error.name,
                        description: (error.message + "\n" + error.stack).substr(0, 1024)
                    }
                });
            });

            client.on("commandError", (cmd, err, msg) => {
                ch.send({
                    embed: {
                        title: cmd.name + " - " + err.name,
                        description: (err.message + "\n" + err.stack).substr(0, 1024),
                        footer: {
                            text: msg.guild.name
                        }
                    }
                });
            });

            process.on("unhandledRejection", async e => {
                try {
                    await ch.send({
                        embed: {
                            title: "Rejection - " + e.name,
                            description: (e.message + "\n" + e.stack).substr(0, 1024)
                        }
                    });
                } catch(e) {
                    console.warn("[REJECTION LOG] Rejection log error", e);
                }
            });
        })();
    }
});

process.on("unhandledRejection", (e) => {
    console.error("[REJECTION]", e);
    if(e.name === "HTTPError" || e.name === "AbortError" || e.name === "HTTPError [AbortError]") {
        process.exit(1);
    }
});

/*
Smooth corners
╭─────────────────────────────────────────────╮
│ ╭─────╮ ╭─────╮ ╭──────╮ ┌──────╮ ╭──╮ ╭──╮ │
│ │ ╭─╮ │ │ ╭───╯ │ ╭──╮ │ │ ┌──╮ │ │  │ │  │ │
│ │ ╰─╯ │ │ ╰──╮  │ ╰──╯ │ │ │  │ │ │  ╰─╯  │ │
│ │    ─┤ │ ╭──╯  │ ╭──╮ │ │ │  │ │ ╰──╮ ╭──╯ │
│ │ ├─╮ │ │ ╰───╮ │ │  │ │ │ └──╯ │    │ │    │
│ ╰─╯ ╰─╯ ╰─────╯ ╰─╯  ╰─╯ └──────╯    ╰─╯    │
╰─────────────────────────────────────────────╯

Hard corners
╭─────────────────────────────────────────────╮
│ ┌─────┐ ┌─────┐ ┌──────┐ ┌──────╮ ┌──┐ ┌──┐ │
│ │ ┌─┐ │ │ ┌───┘ │ ┌──┐ │ │ ┌──╮ │ │  │ │  │ │
│ │ └─┘ │ │ └──┐  │ └──┘ │ │ │  │ │ │  └─┘  │ │
│ │    ─┤ │ ┌──┘  │ ┌──┐ │ │ │  │ │ └──┐ ┌──┘ │
│ │ ├─┐ │ │ └───┐ │ │  │ │ │ └──╯ │    │ │    │
│ └─┘ └─┘ └─────┘ └─┘  └─┘ └──────╯    └─┘    │
╰─────────────────────────────────────────────╯

Mixed corners
╭─────────────────────────────────────────────╮
│ ┌─────╮ ┌─────╮ ╭──────╮ ┌──────╮ ┌──┐ ┌──┐ │
│ │ ╭─╮ │ │ ╭───╯ │ ╭──╮ │ │ ┌──╮ │ │  │ │  │ │
│ │ ╰─╯ │ │ ╰──╮  │ ╰──╯ │ │ │  │ │ │  ╰─╯  │ │
│ │    ─┤ │ ╭──╯  │ ╭──╮ │ │ │  │ │ ╰──╮ ╭──╯ │
│ │ ├─╮ │ │ ╰───╮ │ │  │ │ │ └──╯ │    │ │    │
│ └─╯ ╰─╯ └─────╯ └─┘  └─┘ └──────╯    └─┘    │
╰─────────────────────────────────────────────╯

Rough
╭─────────────────────────────────────────────╮
│  _____   _____   ______   _____  ___    ___ │
│ │ ___ │ │ ____| │ ____ │ │ __  \ \  \  /  / │
│ │ |_| │ │ |__   │ |__| │ │ │ \  │ \  \/  /  │
│ │    _| │  __|  │  __  │ │ │  │ │  \    /   │
│ │ |\ \  │ |___  │ │  │ │ │ |_/  │   │  │    │
│ |_| \_\ |_____| |_|  |_| |_____/    |__|    │
|                                             |
╰─────────────────────────────────────────────╯
*/
