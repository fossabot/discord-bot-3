const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

const got = require("got");

module.exports = class Reddit extends commando.Command {
    constructor(client) {
        super(client, {
            name: "reddit",
            memberName: "reddit",
            aliases: ["meme", "memes", "dankmeme", "dankmemes", "cursedimage", "cursedimages"],
            group: "essentials",
            description: "Gets random image from given subreddit. Can be used with or without r/",
            args: [
                {
                    type: "string",
                    key: "reddit",
                    prompt: "Which subreddit to get image from?",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        if(!cmd.reddit.length) {
            console.log("alias", "'" + msg.alias + "'");
            if(!msg.alias) return msg.reply("Missing subreddit");
            switch(msg.alias) {
                case "meme":
                case "memes":
                    cmd.reddit = "memes";
                    break;
                case "dankmeme":
                case "dankmemes":
                    cmd.reddit = "dankmemes";
                    break;
                case "cursedimage":
                case "cursedimages":
                    cmd.reddit = "cursedimages";
                    break;
            }
        }
        if(cmd.reddit.substr(0, 2) === "r/") cmd.reddit = cmd.reddit.substr(2);
        var subreddit = cmd.reddit;

        var embed = newEmbed();
        got(`https://imgur.com/r/${subreddit}/hot.json`).then(res => {
            var response = JSON.parse(res.body);
            var obj = response.data[Math.floor(Math.random() * response.data.length)];

            embed.setTitle(obj.title);
            embed.setImage("https://imgur.com/" + obj.hash + obj.ext.replace(/\?.*/, ""));
            var author = obj.author;
            var reddit = obj.reddit;
            got(`https://www.reddit.com/user/${obj.author}/about.json`)
                .then(response => {
                    var res = JSON.parse(response.body);

                    embed.setAuthor(author, res.data.icon_img, "https://reddit.com" + reddit);
                    embed.setURL("https://reddit.com" + reddit);
                    msg.channel.send(embed);
                }).catch(console.log);
        }).catch((e) => {
            console.log(e);
            msg.channel.send("An error occured. Is this subreddit public?");
        });
    }
};
