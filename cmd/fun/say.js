const commando = require("@iceprod/discord.js-commando");

module.exports = class Say extends commando.Command {
    constructor(client) {
        super(client, {
            name: "say",
            memberName: "say",
            group: "fun",
            description: "Make the bot say what you want",
            args: [
                {
                    type: "string",
                    key: "string",
                    prompt: "What do you want bot to say?"
                }
            ]
        });
    }

    run(msg, cmd) {
        msg.channel.send(cmd.string);
    }
};
