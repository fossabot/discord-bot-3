const commando = require("@iceprod/discord.js-commando");
const {
    Worker
} = require("worker_threads");
const path = require("path");

module.exports = class Eval extends commando.Command {
    constructor(client) {
        super(client, {
            name: "eval",
            memberName: "eval",
            aliases: ["node"],
            group: "dev",
            description: "Runs given JS code",
            args: [{
                type: "string",
                key: "js",
                prompt: "Which JS to run?"
            }]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();

        const worker = new Worker(path.join(__dirname, "/eval/worker.js"), {
            workerData: {
                js: cmd.js,
                lang: {
                    eval: lang.eval,
                    general: {
                        failed: lang.general.failed
                    }
                }
            }
        });
        var timeout = null;
        var done = false;

        worker.on("message", (message) => {
            if(message.type === "ok") {
                msg.channel.send("", { embed: message.embed });
            } else if(message.type === "error") {
                msg.channel.send(lang.eval.eval_err);
            } else {
                return console.log("Doing nothing");
            }
            done = true;
            clearTimeout(timeout);
        });
        worker.on("error", e => {
            console.warn(e);
            msg.channel.send("An error occured during evaluation");
        });
        worker.on("exit", (code) => {
            done = true;
            clearTimeout(timeout);
            if(code !== 0) { msg.channel.send("An error occured during evaluation. (Exit code " + code + ")"); }
        });

        timeout = setTimeout(_ => {
            try {
                if(!done) {
                    worker.terminate();
                    console.log("Killed long taking process");
                    msg.channel.send(lang.eval.killed);
                }
            } catch(e) {
            }
        }, 15000);
    }
};
