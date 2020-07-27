const commando = require("@iceprod/discord.js-commando");
const { flags } = require("../../utils");
const newEmbed = require("../../embed");

function getFlagEmoji(flag) {
    var out = "";
    switch(flag) {
        case "owner": out += "<:certified:737303731779010580>"; break;
        case "developer": out += "<:developer:737304296114094120>"; break;
        case "admin": out += "<:certified:737303731779010580>"; break;
        case "bug_hunter": out += "<:bug_hunter:737312211827032084>"; break;
        case "beta_tester": out += "<:beta_test:737312249923764237>"; break;
    }
    return out;
}

module.exports = class Flags extends commando.Command {
    constructor(client) {
        super(client, {
            name: "flags",
            memberName: "flags",
            aliases: ["badges"],
            group: "essentials",
            description: "Shows list of user flags",
            args: [
                {
                    type: "user",
                    key: "user",
                    default: "",
                    prompt: "which user to get flags from?"
                }
            ]
        });
    }

    async run(msg, { user }) {
        if(!user) user = msg.author;
        await user.fetchUser();
        var embed = newEmbed();

        var member = await msg.guild.member(user);

        embed.setTitle("Badges of **" + member.displayName + "**");
        embed.setDescription("");
        embed.setThumbnail(user.avatarURL());

        for(var flag in flags) {
            if(!(flags[flag] & user.flags)) continue;

            embed.description += getFlagEmoji(flag) + " **" + flag.substr(0,1).toUpperCase() + flag.substr(1).replace(/_/g, " ") + "**\n";
        }

        if(embed.description === "") embed.setDescription("User does not have any flags.");

        msg.say(embed);
    }
};
