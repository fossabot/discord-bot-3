const commando = require("@iceprod/discord.js-commando");
const got = require("got");
const cheerio = require("cheerio");
const newEmbed = require("../../embed");

module.exports = class phpeval extends commando.Command {
    constructor(client) {
        super(client, {
            name: "phpeval",
            memberName: "phpeval",
            group: "dev",
            description: "Executes given PHP code.",
            args: [
                {
                    key: "code",
                    prompt: "what's the code to eval?",
                    type: "string"
                }
            ]
        });
    }

    async run(msg, { code }) {
        var m = await msg.channel.send("Running...");
        await got.post("http://www.writephponline.com/helper_functions.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Origin: "http://www.writephponline.com",
                Referer: "http://www.writephponline.com/",
                "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
            },
            body: "editor_code=" + encodeURIComponent(code).replace(/%20/, "+") + "&valid_request=Y"
        });
        var { body } = await got.post("http://www.writephponline.com/", {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Origin: "http://www.writephponline.com",
                Referer: "http://www.writephponline.com/",
                "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
            },
            body: "editor_code=" + encodeURIComponent(code).replace(/%20/, "+")
        });
        var $ = cheerio.load(body);
        var res = await $(".section.result").text();

        var embed = newEmbed();
        embed.setTitle("PHP Results");
        embed.setDescription("```\n" + res.trim().substr(0, 1016) + "\n```");
        if(res.length > 1016) embed.setTitle("PHP Results | Truncated");

        m.edit("", embed);
    }
};
