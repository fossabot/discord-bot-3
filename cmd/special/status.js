const commando = require("@iceprod/discord.js-commando");

module.exports = class Status extends commando.Command {
    constructor(client) {
        super(client, {
            name: "status",
            group: "special",
            memberName: "status",
            description: "Set the bots activity/status",
            ownerOnly: true,
            args: [
                {
                    type: "string",
                    key: "type",
                    oneOf: ["watching", "playing", "streaming", "listening"],
                    prompt: "Which kind of status?",
                    default: "WATCHING"
                },
                {
                    type: "string",
                    key: "name",
                    prompt: "What should the status be?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        const status = {
            name: cmd.name,
            type: cmd.type.toUpperCase()
        };
        await msg.client.provider.set("global", "status", status);
        msg.client.user.setActivity(status.name, { type: status.type });
        msg.say("Done!");
    }
};
