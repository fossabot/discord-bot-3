const commando = require("@iceprod/discord.js-commando");
const figlet = require("figlet");

module.exports = class Ascii extends commando.Command {
    constructor(client) {
        super(client, {
            name: "ascii",
            aliases: ["figlet"],
            memberName: "ascii",
            description: "Makes ascii text. For list of fonts, see [figlet.js](https://github.com/patorjk/figlet.js/).",
            usage: "ascii [font] <text>",
            group: "fun",
            args: [
                {
                    type: "string",
                    key: "font",
                    prompt: "What font to use? If not valid, 'Doom' is used.",
                    default: "Doom"
                },
                {
                    type: "string",
                    key: "text",
                    prompt: "Text to use"
                }
            ]
        });
    }

    async run(msg, { text, font }) {
        var lang = await msg.guild.lang();
        if(!figlet.fontsSync().includes(font)) {
            text = font + text;
            font = "Doom";
        }
        figlet.text(text, font, (err, rendered) => {
            if(err) return msg.channel.send(lang.general.error);
            rendered = rendered.trimRight();
            msg.channel.send("```\n" + rendered + "\n```");
        });
    }
};
