const commando = require("@iceprod/discord.js-commando");
const fs = require("fs");
const { exec } = require("child_process");
require("colors");

module.exports = class runscripts extends commando.Command {
    constructor(client) {
        super(client, {
            name: "runscripts",
            aliases: ["run"],
            memberName: "runscripts",
            group: "special",
            description: "Runs custom script",
            ownerOnly: true,
            args: [
                {
                    key: "script",
                    type: "string",
                    prompt: "Which script to run?",
                    validate(val) {
                        return fs.existsSync("./scripts/" + val.replace("/", "_")) || fs.existsSync("./scripts/" + val.replace("/", "_") + ".sh");
                    },
                    parse(val) {
                        return fs.existsSync("./scripts/" + val.replace("/", "_")) ? "./scripts/" + val.replace("/", "_") : "./scripts" + val.replace("/", "_") + ".sh";
                    }
                }
            ]
        });
    }

    run(msg, { script }) {
        exec("./scripts/" + script, async (err, sout, serr) => {
            await msg.channel.send("Done");
            if(err) await msg.channel.send("```\n" + err.message + "```");
            if(sout) await msg.channel.send("```\n" + sout + "```");
            if(serr) await msg.channel.send("```\n" + serr + "```"); 
        });
    }
};

if(require("os").platform() === "win32") {
    console.warn("[WARNING] Windows support for scripts is limited and may not work.".yellow);
}