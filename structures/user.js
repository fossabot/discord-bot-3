const {
    Structures
} = require("discord.js");
const newEmbed = require("../embed");
const pool = require("../managers/pool_mysql");
const { insertAt } = require("../utils");

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
            if(!global.dbl) return true;
            return await global.dbl.hasVoted(this.id);
        }

        async getUser() {
            var query;
            query = "SELECT * FROM users WHERE discord=?";
            var [results] = await pool.query(query, [this.id]);

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
            var query = "INSERT INTO users (discord) VALUE (?)";
            var [results] = await pool.query(query, [this.id]);
            var query2 = "SELECT * FROM users WHERE id=?";
            var [user] = await pool.query(query2, [results.insertId]);
            return user[0];
        }

        async boostedGuild(guild) {
            if(typeof guild !== "string") guild = guild.id;
            await this.fetchUser();

            var [res] = await pool.query("SELECT levels FROM boosts WHERE guild = ? AND user = ?", [guild, this.db_id]);
            if(res && res[0]) return res[0].levels;
            return false;
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

        saveFlags() {
            return pool.query("UPDATE users SET flags = ? WHERE id = ?", [this.flags, this.db_id]);
        }

        getNextLevel() {
            var level = this.level;
            return xpBreakpoints[level + 1];
        }

        getNextLevelXP() {
            var level = this.level;
            return xpBreakpoints[level + 1] - xpBreakpoints[level];
        }

        getXP() {
            var level = this.level;
            return this.xp - xpBreakpoints[level];
        }

        get level() {
            for(var breakPoint in xpBreakpoints) {
                // eslint-disable-next-line keyword-spacing
                if(xpBreakpoints[breakPoint] > this.xp) return Number(breakPoint) - 1;
            }
            return Infinity;
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
            await this.fetchUser();
            const id = this.db_id;
            var query = "INSERT INTO achievments_awarded (user, achievment) VALUES (?, (SELECT id FROM achievments WHERE code=?))";

            var [results] = await pool.query(query, [id, code]);
            var [ac] = pool.query("SELECT * FROM achievments WHERE code=?", [code]);
            var a = ac[0];
            await pool.query("UPDATE users SET bbs = bbs + ?, xp = xp + ? WHERE id = ?", [a.value, a.xp, id]);
            var level = this.updateLevels();
            if(level) {
                this.levelUp(level, msg);
            }
            return results;
        }

        async levelUp(level, msg) {
            var embed = newEmbed();
            embed.setTitle(msg.author.username + " leveled up! ");
            embed.setDescription("Current level is " + level + ". XP points owned: " + this.user.xp + " / " + this.getNextLevel());
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
                await this.awardAchievment(code, msg);
                achievmentsAwarded = await this.achievments();
                msg.channel.send(this.sendAchievment(achievmentsAwarded[0], msg));
            }
        }

        awardAchievementUnique(...args) {
            return this.sendAchievementUnique(...args);
        }

        updateLevels() {
            var level = this.level;
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
