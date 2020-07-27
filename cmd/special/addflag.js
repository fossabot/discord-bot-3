const commando = require("@iceprod/discord.js-commando");
const { flags } = require("../../utils");

module.exports = class AddFlag extends commando.Command {
    constructor(client) {
        super(client, {
            name: "addflag",
            memberName: "addflag",
            aliases: ["toggleflag"],
            group: "special",
            description: "Add flag to user",
            ownerOnly: true,
            args: [
                {
                    type: "user",
                    key: "user",
                    prompt: "which user to give flag to?"
                },
                {
                    type: "string",
                    key: "flag",
                    oneOf: ["developer", "admin", "bug_hunter", "beta_tester"],
                    prompt: "which flag to add?"
                }
            ]
        });
    }

    async run(msg, { user, flag }) {
        await user.fetchUser();

        user.flags ^= flags[flag];
        await user.saveFlags();

        msg.channel.send("Saved!");
    }
};
