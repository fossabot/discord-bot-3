const {
    Structures
} = require("discord.js");
const pool = require("../managers/pool_mysql");
const Player = require("../services/player/player");

console.log("[LANG] Loading....");
const lang = require("../translation/translation")();
console.log("[LANG] Loaded");

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

        async isPremium() {
            if(this.premium === undefined) {
                var [res] = await pool.query("SELECT SUM(levels) as level FROM boosts WHERE guild = ?", [this.id]);
                if(!res) this.premium = 0;
                if(!res[0]) this.premium = 0;
                if(this.premium === 0) return 0;
                this.premium = res[0].level;
                return res[0].level;
            } else {
                return this.premium;
            }
        }
    };
});
