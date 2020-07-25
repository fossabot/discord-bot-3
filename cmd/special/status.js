const commando = require("@iceprod/discord.js-commando");
const { shortNumber } = require("../../utils");

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
        }

        const name = cmd.name
            .replace(/\{\{users\}\}/gi, () => {
                done += ("\nUsers: " + users);
                return shortNumber(users);
            })
            .replace(/\{\{(guilds|servers)\}\}/gi, () => {
                done += ("\nGuilds: " + guilds);
                return shortNumber(guilds);
            });

        const status = {
            name: name,
            type: cmd.type.toUpperCase()
        };

        await msg.client.provider.set("global", "status", status);
        msg.client.user.setActivity(status.name, { type: status.type });

        msg.say(done);
    }
};
