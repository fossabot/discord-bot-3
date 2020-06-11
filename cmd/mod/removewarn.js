const { Command } = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");

module.exports = class removewarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: "removewarn",
            group: "mod",
            memberName: "removewarn",
            description: "Remove a warn from a user",
            userPermissions: ["KICK_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    type: "integer",
                    key: "case",
                    prompt: "which warn case do you want to remove?"
                }
            ]
        });
    }

    run(msg, cmd) {
        const Case = msg.guild.settings.get(`case.${cmd.case}`);
        if(!Case) return msg.say(`Case '${cmd.case}' not found`);
        if(Case.removed) return msg.say("This warn has already been removed!");

        Case.removed = true;

        const warnCount = msg.guild.settings.get(`warns.${Case.offenderID}`, 1);
        msg.guild.settings.set(`warns.${Case.offenderID}`, warnCount - 1);

        const embed = newEmbed();
        embed.setColor("GREEN");
        embed.setAuthor(`${msg.author.username} | Case ${Case.id}`, msg.author.displayAvatarURL());
        embed.setDescription(`✅ Successfully removed warning from user <@${Case.offenderID}>`);
        return msg.embed(embed);
    }
};
