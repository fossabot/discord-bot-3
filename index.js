const Commando = require("@iceprod/discord.js-commando");
const path = require("path");
const sl = require("singleline");
const config = require("./config.json");
const Snoowrap = require("snoowrap");
const requireAll = require("require-all");

var dbl;

require("./structures/");

function requireDirectory(directory) {
    return Object.values(requireAll({
        dirname: require("path").join(__dirname, directory)
    }));
}

const messageServices = requireDirectory("/services/message");
const inhibitors = requireDirectory("./services/inhibitors");

const client = new Commando.Client({
    owner: ["147365975707090944", "236504705428094976"],
    commandPrefix: "aztec ",
    invite: "<https://discord.gg/8fqEepV>",
    messageCacheMaxSize: 50, // max 50 messages per channel
    messageCacheLifetime: 180, // cache last 3 minutes of messages
    messageSweepInterval: 30
});

if(config.dbl) {
    const DBL = require("dblapi.js");
    dbl = new DBL(config.dbl, client);

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
    let loadedCommands = new Map();
    
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
            console.log(`[LOAD] Found \u001b[37;1m${length.toString().padStart(2, " ")}\u001b[0m commands in \u001b[36m${group.id}\u001b[0m`);
        }
        
        console.log("[EVENT]\u001b[37;1m Ready!\u001b[0m");
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

        messageServices.push(require("./services/message/reddit")(r));

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
            .registerCommandsIn(path.join(__dirname, "cmd"));
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

client.on("message", async msg => {
    for(var service of messageServices) {
        await service(msg);
    }
});

for(var inhibitor of inhibitors) {
    client.dispatcher.addInhibitor(inhibitor);
}

client.login(config.token);

client.once("providerReady", async p => {
    const activity = await p.get("global", "status");
    client.user.setActivity(
        activity.name,
        { type: activity.type }
    );
});

client.on("guildCreate", async g => {
    var ch = await client.channels.fetch("693843633442521210");
    ch.send({
        title: "New guild - " + g.title,
        description: "Members: " + g.memberCount
    });
});

client.on("guildDelete", async g => {
    var ch = await client.channels.fetch("693843633442521210");
    ch.send({
        title: "Guild removed - " + g.title,
        description: "Members: " + g.memberCount
    });
});

process.on("unhandledRejection", (e) => {
    console.error("[REJECTION]", e);
    if(e.name === "HTTPError" || e.name === "AbortError" || e.name === "HTTPError [AbortError]") {
        process.exit(1);
    }
});
