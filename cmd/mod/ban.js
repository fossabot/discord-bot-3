const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "mod",
            memberName: "ban",
            description: "Bans a user",
            usage: "ban <user> <daysToDeleteMessages> <reason>",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which user do you want to ban?"
                },
                {
                    type: "string",
                    key: "reason",
                    prompt: "why do you want to ban this user?",
                    default: "No reason specified"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = msg.guild.lang();
        var daysToDelete = 0;
        if(parseInt(cmd.reason.split(" ")[0])) daysToDelete = parseInt(cmd.reason.split(" ")[0]);
        // if (this.client.isOwner(cmd.user.id)) return msg.say("You can't ban an owner of this bot!");

        if(msg.guild.member(cmd.user)) {
            if(cmd.user === this.client.user) return msg.say(lang.ban.bot);
            if(msg.author === cmd.user) return msg.say(lang.ban.self);
            if(msg.member.guild.me.roles.highest.comparePositionTo(msg.guild.member(cmd.user).roles.highest) <= 0 || !msg.guild.member(cmd.user).bannable) return msg.say(lang.ban.bot.low);
            if(msg.member.roles.highest.comparePositionTo(msg.guild.member(cmd.user).roles.highest) <= 0) return msg.say(lang.ban.low);
        }

        if(cmd.reason.length > 256) return msg.say(lang.ban.long);

        await msg.guild.ban(cmd.user, {
            reason: cmd.reason,
            days: daysToDelete
        });
        // Set number of total cases in the server
        const totalCaseCount = await msg.guild.settings.get("totalcasecount", 0);

        // Store details about this case
        const Case = {
            id: totalCaseCount,
            type: "ban",
            offender: cmd.user.tag,
            offenderID: cmd.user.id,
            moderator: msg.author.tag,
            moderatorID: msg.author.id,
            reason: cmd.reason
        };

        let reason = cmd.reason;
        if(cmd.reason.length > 20) reason = cmd.reason.substr(0, 20) + "...";

        const embed = newEmbed();
        embed.setColor("RED");
        embed.setAuthor(lang.ban.text.replace("%n", Case.id).replace("%s", reason), msg.author.displayAvatarURL());
        embed.setDescription(lang.ban.mod.replace("%u", Case.moderator).replace("%n", Case.id).replace("%s", await msg.guild.settings.get("prefix", msg.client.commandPrefix)));

        msg.embed(embed);
    }
};
