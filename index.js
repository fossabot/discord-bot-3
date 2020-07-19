const Commando = require("@iceprod/discord.js-commando");
const {
    Structures
} = require("discord.js");
const path = require("path");
const sl = require("singleline");
const config = require("./config.json");
const pool = require("./managers/pool_mysql");
const Player = require("./services/player/player");
const Snoowrap = require("snoowrap");
const newEmbed = require("./embed");
const { insertAt } = require("./utils");

console.log("[LANG] Loading....");
const lang = require("./translation/translation")();
console.log("[LANG] Loaded");

var dbl;

Structures.extend("Guild", (Guild) => {
    return class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.music = new Player(this);
        }

        /**
         * @returns {object} language object
         */
        async lang() {
            var lan = await this.settings.get("lang", "en");
            return lang.get(lan).lang;
        }
    };
});

Structures.extend("User", (User) => {
    const xpBreakpoints = [];

    {
        const baseXP = 15;
        const numlevels = 150;
        let tempXP = 0;

        for(let level = 0; level < numlevels; level++) {
            tempXP = baseXP * (level * (level - 1) / 2);
            xpBreakpoints[level] = tempXP;
        }
    }
    xpBreakpoints.shift(); // remove -0

    return class DBLUser extends User {
        async hasVoted() {
            if(!dbl) return true;
            return await dbl.hasVoted(this.id);
        }

        async getUser(uuid) {
            var query;
            if(uuid) {
                query = "SELECT * FROM users WHERE uuid=?";
            } else {
                query = "SELECT * FROM users WHERE discord=?";
            }
            var [results] = await pool.query(query, [uuid || this.id]);

            if(results === undefined) return null;

            return results[0];
        }

        async fetchUserId() {
            var query = "SELECT  * FROM users WHERE id=?";
            var [results] = await pool.query(query, [this.db_id]);
            if(!results) return null;
            return results[0];
        }

        async createUser() {
            var uuid = "unhex(replace(uuid(),'-',''))";
            var query = "INSERT INTO users (uuid_bin, discord) VALUE (?, ?)";
            var [results] = await pool.query(query, [uuid, this.id]);
            var query2 = "SELECT  * FROM users WHERE id=?";
            var [user] = await pool.query(query2, [results.insertId]);
            return user[0];
        }

        /**
         * Fetches user from DB.
         */
        async fetchUser() {
            if(this.db_id) return this; // cache, do not re-request data
            var user = await this.getUser();
            if(!user) {
                user = await this.createUser();
            } else if(!user) {
                user = undefined;
            }

            var map = {
                id: "db_id"
            };
            for(var prop in user) {
                this[map[prop] || prop] = user[prop];
            }

            return user;
        }

        getNextLevel(xp = this.xp) {
            var i = 0;
            var minDiff = 1000;
            var ans;

            for(i in xpBreakpoints) {
                var m = Math.abs(xp - xpBreakpoints[i]);
                if(m < minDiff) {
                    minDiff = m;
                    ans = xpBreakpoints[i];
                }
            }

            return parseInt(ans);
        }

        getPrevLevel(xp = this.xp) {
            var i = 0;
            var minDiff = 1000;
            var ans;

            for(i in xpBreakpoints) {
                var m = Math.abs(xp - xpBreakpoints[i - 1]);
                if(m < minDiff) {
                    minDiff = m;
                    ans = xpBreakpoints[i - 1];
                }
            }

            return parseInt(ans) + 1;
        }

        get level() {
            var i = 0;
            var minDiff = 1000;
            var ans;

            for(i in xpBreakpoints) {
                var m = Math.abs(this.xp - xpBreakpoints[i]);
                if(m < minDiff) {
                    minDiff = m;
                    ans = i;
                }
            }

            return parseInt(ans) + 1;
        }

        get money() {
            var bbs = this.bbs.toString().padStart(4, "0");
            return insertAt(bbs, ".", bbs.length - 3);
        }

        async mine() {
            var d;
            try {
                var t = this.last_mined.split(/[- :]/);
                d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
            } catch(e) {
                d = this.last_mined;
            }

            var now = Date.now();
            const oneDay = 60 * 60 * 12 * 1000;

            try {
                var canMine = (now - d) > oneDay;
            } catch(e) {
                canMine = true;
            }

            if(canMine) {
                var currentTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
                await pool.query(
                    "UPDATE users SET last_mined=?, bbs=?, xp=? WHERE id=?",
                    [currentTimestamp, (parseInt(this.bbs) + this.level), parseInt(this.xp) + this.level, this.db_id]
                );
                return true;
            } else {
                return (oneDay - (now - d));
            }
        }

        async pay(target, bbs) {
            await pool.query("UPDATE users SET BBS=BBS + ? WHERE id=?", [bbs, target]);
            await pool.query("UPDATE users SET BBS=BBS - ? WHERE id=?", [bbs, this.db_id]);
        }

        async achievments() {
            var [res] = await pool.query(
                `SELECT *, u.xp as u_xp FROM users u, achievments_awarded d, achievments a
                    WHERE u.id=? AND d.achievment = a.id AND d.user = u.id ORDER BY d.id DESC`,
                [this.db_id]
            );
            return res;
        }

        async awardAchievment(code, msg) {
            const id = this.db_id;
            var query = "INSERT INTO achievments_awarded (user, achievment) VALUES (?, (SELECT id FROM achievments WHERE code=?))";

            var [results] = await pool.query(query, [id, code]);
            var [ac] = pool.query("SELECT * FROM achievments WHERE code=?", [code]);
            var a = ac[0];
            await pool.query("UPDATE users SET bbs = bbs + ?, xp = xp + ? WHERE id = ?", [a.value, a.xp, id]);
            var level = this.updateLevels(await this.fetchUser());
            if(level) {
                var [res] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
                this.levelUp(level, msg, res[0]);
            }
            return results;
        }

        async levelUp(level, msg, user) {
            var embed = newEmbed();
            embed.setTitle(msg.author.username + " leveled up! ");
            embed.setDescription("Current level is " + level + ". XP points owned: " + user.xp + " / " + this.getNextLevel(user.xp));
            if(await msg.guild.settings.get("levelup", true)) {
                msg.channel.send(embed);
            }
        }

        sendAchievment(a, msg, send = true) {
            var embed = newEmbed();
            var user = msg.author;
            embed.setTitle((send ? "Achievment Awarded: " : "") + a.name);
            embed.setDescription(a.description);
            embed.setAuthor(user.username + "#" + user.discriminator, user.avatarURL());
            embed.addField("BBS", a.value / 1000, true);
            embed.addField("XP", a.xp, true);
            embed.setTimestamp();

            return embed;
        }

        async sendAchievementUnique(msg, code) {
            await this.fetchUser();
            var achievmentsAwarded = await this.achievments();
            var hasAchievement = false;
            achievmentsAwarded.forEach((a) => {
                if(a.code === code) hasAchievement = true;
            });
            if(!hasAchievement) {
                this.awardAchievment(code, msg);
                achievmentsAwarded = await this.achievments();
                msg.channel.send(this.sendAchievment(achievmentsAwarded[0], msg));
            }
        }

        awardAchievementUnique(...args) {
            return this.sendAchievementUnique(...args);
        }

        updateLevels() {
            var level = this.getLevel();
            if(this.last_level !== level) {
                pool.query("UPDATE users SET last_level = " + level + " WHERE id = " + this.db_id, (e) => {
                    if(e)throw e;
                });
                return level;
            }
            return null;
        }
    };
});

Structures.extend("GuildMember", (GM) => {
    return class GuildMember extends GM {
        /**
         * Bans user from guild
         * @param {Object} param0
         */
        async ban({
            reason,
            days,
            author
        }) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "ban",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const embed = newEmbed();
            embed.setColor("RED");
            embed.setAuthor(`Ban ${Case.id}"`, author.avatarURL());
            embed.setTitle("You were banned in " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            await this.send(embed);

            return super.ban({
                reason,
                days
            });
        }

        /**
         * Kicks user from guild
         * @param {string} reason
         * @param {any} author
         */
        async kick(reason, author) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "ban",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const embed = newEmbed();
            embed.setColor("RED");
            embed.setAuthor(`Kick ${Case.id}"`, author.avatarURL());
            embed.setTitle("You were kicked from " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            this.send(embed);

            return super.kick(reason);
        }

        /**
         * Warns user
         * @param {string} reason
         * @param {any} author
         */
        async warn(reason, author) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "warn",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason,
                removed: false
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const warnCount = this.guild.settings.get(`warns.${this.user.id}`, 1);
            await this.guild.settings.set(`warns.${this.user.id}`, warnCount + 1);

            const embed = newEmbed();
            embed.setColor("GOLD");
            embed.setAuthor(`Warn ${Case.id}`, author.avatarURL());
            embed.setTitle("You were warned in " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            await this.send(embed);

            return this;
        }
    };
});

Structures.extend("TextChannel", (TC) => {
    return class TextChannel extends TC {
        sendFile(file) {
            return this.send({
                files: [file]
            });
        }
    };
});

const messageServices = [
    require("./services/message/messagePreview"),
    require("./services/message/links"),
    require("./services/message/nsfw"),
    require("./services/message/subscriptions")
];

const inhibitors = [
    require("./services/inhibitors/checkChannel")
];

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

var loadedCommands = new Map();

client.on("commandRegister", c => {
    loadedCommands.set(c.name, c);
});

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
    client.user.setActivity(
        await p.get("global", "status").name,
        { type: await p.get("global", "status").type }
    );
});

process.on("unhandledRejection", (e) => {
    console.error("[REJECTION]", e);
    if(e.name === "HTTPError" || e.name === "AbortError" || e.name === "HTTPError [AbortError]") {
        process.exit(1);
    }
});
