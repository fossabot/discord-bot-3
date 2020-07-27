const commando = require("@iceprod/discord.js-commando");
const fs = require("fs");
const path = require("path");
require("colors");

module.exports = class BotSettings extends commando.Command {
    constructor(client) {
        super(client, {
            name: "botsettings",
            group: "special",
            memberName: "botsettings",
            description: "Edit config.json settings",
            ownerOnly: true,
            args: [
                {
                    type: "string",
                    key: "key",
                    prompt: "Which key should be edited?"
                },
                {
                    type: "string",
                    key: "value",
                    prompt: "What should the new value be?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        try {
            const fileName = "config.json";
            const file = require(path.join(__dirname, "/../../config.json"));

            file[cmd.key] = cmd.value;
            fs.writeFile(fileName, JSON.stringify(file, null, 4), err => {
                if(err) return console.error(err);
                console.log("[EVENT] config.json edited".yellow);
                msg.say("Done!");
            });
        } catch(e) {
            throw new Error(e);
        }
    }
};
