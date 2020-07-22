const commando = require("@iceprod/discord.js-commando");
const fs = require("fs");
require("colors");

module.exports = class Settings extends commando.Command {
    constructor(client) {
        super(client, {
            name: "settings",
            group: "special",
            memberName: "settings",
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
            const fileName = "../../config.json";
            const file = require(fileName);

            file[cmd.key] = cmd.value;

            fs.writeFile(fileName, JSON.stringify(file, null, 4), err => {
                if(err) return console.error(err);
                console.log("[EVENT] config.json edited".yellow);
                msg.say("Done!");
            });
        } catch(e) {
            throw new Error();
        }
    }
};
