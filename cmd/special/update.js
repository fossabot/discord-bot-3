const commando = require("@iceprod/discord.js-commando");
const { exec } = require("child_process");

module.exports = class update extends commando.Command {
    constructor(client) {
        super(client, {
            name: "update",
            memberName: "update",
            group: "special",
            ownerOnly: true,
            description: "Updates the bot",
            args: []
        });
    }
    run(msg) {
        exec("git pull", async (err, sout, serr) => {
            await msg.channel.send("Done");
            if(err) await msg.channel.send("```\n" + err.message + "```");
            if(sout) await msg.channel.send("```\n" + sout + "```");
            if(serr) await msg.channel.send("```\n" + serr + "```"); 
        });
    }
};