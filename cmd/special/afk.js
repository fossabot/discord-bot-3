const commando = require("@iceprod/discord.js-commando");

module.exports = class AFK extends commando.Command {
    constructor(client) {
        super(client, {
            name: "afk",
            group: "special",
            memberName: "afk",
            description: "Toggles the bots afk status",
            ownerOnly: true,
            args: [
                {
                    type: "boolean",
                    key: "afk",
                    prompt: "Please select an AFK option? (true/false)",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        msg.client.user.setAFK(cmd.afk || msg.client.user.presence.status !== "idle");
        msg.say("Done!");
    }
};
