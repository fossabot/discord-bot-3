const newEmbed = require("../../../embed");
const moment = require("moment");
const { flags } = require("../../../utils");

function getRoles(msg, user) {
    const roles = msg.guild.member(user).roles.cache.array();
    const result = roles.sort((a, b) => (a.position > b.position) ? -1 : ((b.position > a.position) ? 1 : 0));
    roles.pop();
    return result.join(" - ");
}

function getStatus(status) {
    switch(status) {
        case "idle":
            return "<:status_idle:737304031436734485> ";
        case "dnd":
            return "<:status_dnd:737304073451339777>";
        case "online":
            return "<:status_online:737303957013004329>";
        case "offline":
            return "<:status_offline:737304154330103918>";
    }
}

function getFlags(user) {
    var out = "";
    for(var flag in flags) {
        if(!(flags[flag] & user.flags)) continue;

        switch(flag) {
            case "owner": break;
            case "developer": out += "<:developer:737304296114094120>"; break;
            case "admin": out += "<:certified:737303731779010580>"; break;
            case "bug_hunter": out += "<:bug_hunter:737312211827032084>"; break;
            case "beta_tester": out += "<:beta_test:737312249923764237>"; break;
        }
    }
    return out;
}

function getPlatform(status) {
    if(!status) return "";

    var returned = "";

    if(status.web) returned += ":globe_with_meridians: ";
    if(status.phone) returned += ":iphone: ";
    if(status.desktop) returned += ":desktop:";

    return returned.trim();
}

module.exports = async (msg, cmd) => {
    var user = cmd.pointer ? cmd.pointer : msg.author;
    var limited = false;

    try {
        await user.fetchUser();
    } catch(e) {
        limited = true;
    }

    if(msg.guild) {
        var offenseNum = 0;
        const iterable = {
            [Symbol.asyncIterator]: () => {
                var current = 0;
                return {
                    async next() {
                        current++;
                        var data = await msg.guild.settings.get("case." + current, null);
                        if(!data) {
                            return { value: null, done: true };
                        }
                        return { value: data, done: false };
                    }
                };
            }
        };

        for await(var Case of iterable) {
            if(Case.offenderID === user.id && !Case.removed) {
                offenseNum++;
            }
        }
    }

    var embed = newEmbed()
        .setTitle(`${user.tag} ${getStatus(user.presence.status)} ${getPlatform(user.presence.clientStatus)} ${user.bot || user.id === "672165988527243306" ? "<:bot:737305735100366858>" : ""} ${limited ? "" : getFlags(user)}`)
        .setThumbnail(user.avatarURL())
        .addField("» ID", user.id, true);
    if(!limited) {
        embed
            .addField("» Donor", (user.donor_tier > 0 ? ":white_check_mark: Tier " + user.donor_tier : ":x: Not donor"), true)
            .addField("» Level", user.level, true)
            .addField("» XP", `${user.xp} / ${user.getNextLevel()} (${Math.round(user.getXP() / user.getNextLevelXP() * 1000) / 10}%)`, true)
            .addField("» BBS", user.money + " BBS", true)
    }
    if(msg.guild) {
        embed.addField("» Boosted", (await user.boostedGuild(msg.guild) ? "Boosted!" : "No"));
        embed.addField("» Offenses", `**${offenseNum}**`, true);
    }
    embed.addField("» Registered", moment(user.createdAt).fromNow(), true);
    if(msg.guild && getRoles(msg, user)) {
        embed.addField("» Roles", getRoles(msg, user), true);
    } else if(msg.guild) {
        embed.addField("» Roles", "none", true);
    }

    msg.say(embed);
};
