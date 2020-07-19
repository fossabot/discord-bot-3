const {
    Structures
} = require("discord.js");
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
    };
});
