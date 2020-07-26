const commando = require("@iceprod/discord.js-commando");

module.exports = class ReloadService extends commando.Command {
    constructor(client) {
        super(client, {
            name: "reloadservice",
            aliases: ["reload-service", "service-reload"],
            memberName: "reloadservice",
            group: "special",
            description: "Reloads service",
            ownerOnly: true,
            args: [
                {
                    type: "string",
                    key: "service",
                    prompt: "which service to reload?"
                }
            ]
        });
    }

    run(msg, { service }) {
        var s = this.client.registry.services.get(service);

        if(!s) {
            // shouldn't be hard to implement, I'll do that later though
            return msg.channel.send("Couldn't find that service. Loading new services is not yet supported.");
        }

        try {
            s.reload();
        } catch(e) {
            console.warn(e);
            try {
                // this can't be shortened as service client is not the commando client itself, it's a fake loader so we can easily load/unload handlers
                if(s.client.handlers.size === 0) {
                    s.load(); // try to load service back if reload failed
                }
            } catch(e) {
                console.warn(e);
            }
            this.client.emit("commandError", this, e, msg);
        }
    }
};
