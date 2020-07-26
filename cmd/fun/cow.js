const commando = require("@iceprod/discord.js-commando");
const cowsay = require("cowsay");

module.exports = class Cow extends commando.Command {
    constructor(client) {
        super(client, {
            name: "cow",
            memberName: "cow",
            group: "fun",
            description: "Ascii cow saying or thinking whatever you want",
            args: [
                {
                    type: "string",
                    key: "variant",
                    oneOf: ["think", "say"],
                    prompt: "Variant to use, think or say?"
                }, {
                    type: "string",
                    key: "text",
                    prompt: "Text to make cow say/think:"
                }
            ]
        });
    }

    run(msg, cmd) {
        var saying = cmd.variant === "say";
        var { text } = cmd;

        text = text
            .replace(/\\`/gi, "")
            .replace(/`/gi, "");

        if(text.length > 1500) {
            return msg.channel.send("Too long message!");
        }

        if(text.length === 0) {
            return msg.channel.send("Please provide a valid text to say/think");
        }

        if(saying) {
            msg.channel.send("```\n" + cowsay.say({ text }) + "\n```");
        } else {
            msg.channel.send("```\n" + cowsay.think({ text }) + "\n```");
        }
    }
};
