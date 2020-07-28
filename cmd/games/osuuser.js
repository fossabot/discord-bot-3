const commando = require("@iceprod/discord.js-commando");
const got = require("got");
const config = require("../../config.json");
const newEmbed = require("../../embed");
const { trimLines } = require("../../utils");
const moment = require("moment");

module.exports = class osuuser extends commando.Command {
    constructor(client) {
        super(client, {
            name: "osuuser",
            memberName: "osuuser",
            aliases: ["ou"],
            group: "games",
            description: "Shows information about osu user",
            args: [
                {
                    key: "user",
                    type: "string",
                    prompt: "which user to search for?"
                },
                {
                    key: "type",
                    type: "string",
                    prompt: "what mode to use?",
                    default: "osu!",
                    oneOf: ["osu!", "osu", "osu!taiko", "taiko", "osu!catch", "catch", "osu!mania", "mania"]
                }
            ]
        });
    }

    async run(msg, { user, type }) {
        switch(type) {
            case "osu!taiko":
            case "taiko":
                type = 1;
                break;
            case "osu!catch":
            case "catch":
                type = 2;
                break;
            case "osu!mania":
            case "mania":
                type = 3;
                break;
            case "osu!":
            case "osu":
            default:
                type = 0;
        }
        var [ud] = await got(`https://osu.ppy.sh/api/get_user?k=${config.osu}&u=${encodeURI(user)}`).json();

        const embed = newEmbed();

        if(ud) {
            embed.setTitle(`:flag_${ud.country.toLowerCase()}: ${ud.username}`);
            embed.setThumbnail("http://s.ppy.sh/a/" + ud.user_id);
            embed.setDescription(trimLines`
                Joined: **${moment(ud.join_date).fromNow()}**
                Ranked score: **${ud.ranked_score}**
                Total score: **${ud.total_score}**
                Play time: **${moment().subtract(ud.total_seconds_played, "seconds").fromNow(true)}**
                Accuracy: **${Math.round(ud.accuracy * 100) / 100}%**
            `);
            embed.footer.text += " | " + ud.user_id;
        } else {
            embed.setColor("red");
            embed.setTitle("User not found");
            embed.setDescription("Couldn't find user with name or id '" + user + "'");
        }

        msg.say(embed);
    }
};

if(!config.osu) module.exports = null;
