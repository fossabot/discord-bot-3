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