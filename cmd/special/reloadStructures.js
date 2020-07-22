const commando = require("@iceprod/discord.js-commando");
const path = require("path");

module.exports = class reloadStructures extends commando.Command {
    constructor(client) {
        super(client, {
            name: "reloadStructures",
            memberName: "reloadStructures",
            group: "special",
            ownerOnly: true,
            description: "Reloads structures - useful when structures were updated during update",
            args: []
        });
    }

    run(msg) {
        delete require.cache[path.join(__dirname, "../../structures/index.js")];
        require("../../structures/index");
        msg.reply("Done");
    }
};
