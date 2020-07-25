const commando = require("@iceprod/discord.js-commando");
const { shortNumber, capitalizeFirstLetter } = require("../../utils");

module.exports = class Status extends commando.Command {
    constructor(client) {
        super(client, {
            name: "status",
            group: "special",
            memberName: "status",
            description: "Set the bots activity/status",
            ownerOnly: true,
            args: [
                {
                    type: "string",
                    key: "type",
                    oneOf: ["watching", "playing", "streaming", "listening"],
                    prompt: "Which kind of status?",
                    default: "WATCHING"
                },
                {
                    type: "string",
                    key: "name",
                    prompt: "What should the status be?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        let done = "Done!";

        if(cmd.name.match(/\{\{[\w.]*?\}\}/g)) {
            var users = 0;
            var guilds = 0;
            for(const guild of this.client.guilds.cache) {
                guilds++;
                users += guild[1].memberCount;
            }
            var vars = {
                users: users,
                guilds: guilds,
                servers: guilds
            };
        }

        const name = cmd.name.replace(/(?<=\{\{)[\w.]*?(?=\}\})/gi, m => {
            m = m.toLowerCase();
            if(!vars[m]) return m;
            done += (`\n**${capitalizeFirstLetter(m)}**: ${shortNumber(vars[m])}`);
            return shortNumber(vars[m]);
        }).replace(/[{}]/g, "");

        const status = {
            name: name,
            type: cmd.type.toUpperCase()
        };

        await msg.client.provider.set("global", "status", status);
        msg.client.user.setActivity(status.name, { type: status.type });

        msg.say(done);
    }
};
