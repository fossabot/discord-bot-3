const newEmbed = require("../../embed");
const Nekos = require("nekos.life");
const neko = new Nekos().sfw;
const commando = require("@iceprod/discord.js-commando");

module.exports = class NekosCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "nekos",
            group: "anime",
            memberName: "nekos",
            description: "Uses the nekos.life API. SFW only.",
            examplesName: "Sub commands",
            examples: ["help", "OwOify"],
            args: [
                {
                    type: "string",
                    key: "command",
                    prompt: "What's the sub-command you want to run?"
                },
                {
                    type: "string",
                    key: "text",
                    default: "",
                    prompt: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        this.lang = lang;
        this.msg = msg;
        this.cmd = cmd;

        var text = [
            "why",
            "catText",
            "fact",
            "OwOify"
        ];

        var allowed = [
            "pat",
            "hug",
            "8Ball"
        ];

        var c = cmd.command;

        if(c === "help")this.help();
        else {
            if(typeof neko[c] === "function") {
                if(text.includes(c)) {
                    this.processText(c);
                } else {
                    if(allowed.includes(c)) {
                        this.nonText(c);
                    } else {
                        msg.channel.send(lang.nekos.tos);
                    }
                }
            } else {
                console.log("Non existent command for nekos:", c, "-", neko[c]);
                msg.channel.send(lang.nekos.sfw);
            }
        }
    }

    async nonText(cmd) {
        var json = await neko[cmd]();
        this.send(json.url);
    }

    async processText(cmd) {
        var text = this.cmd.text;
        let res;
        switch(cmd) {
            case "catText":
                res = await neko.catText({ text });
                this.sendText(res.cat);
                break;
            case "OwOify":
                res = await neko.OwOify({ text });
                this.sendText(res.owo);
                break;
            case "fact":
                res = await neko.fact({ text });
                this.sendText(res.fact);
                break;
            case "why":
                res = await neko.why({ text });
                this.sendText(res.why);
                break;
        }
    }

    sendText(text) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setDescription(text);
        this.msg.channel.send(embed);
    }

    help() {
        this.msg.channel.send(this.lang.nekos.see.replace("%s", "https://github.com/Nekos-life/nekos-dot-life"));
    }

    send(src) {
        var embed = newEmbed();
        embed.setTitle("Nekos!");
        embed.setImage(src);
        this.msg.channel.send(embed);
    }
};
