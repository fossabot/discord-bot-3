const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../embed");
const walkSync = require("walk-sync");
const path = require("path");
const { Collection } = require("discord.js");

const languages = walkSync(path.join(__dirname, "/../../translation/sources/"), {
    directories: false,
    globs: ["**/*.commands.js"]
});

var langs = new Collection();

for(const lang of languages) {
    langs.set(lang.split(".")[0], require(path.join(__dirname, "/../../translation/sources/", lang)));
}

module.exports = class HelpCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "help",
            memberName: "help",
            group: "util",
            aliases: ["commands"],
            description: "Displays a list of available commands, or detailed information for a specified command",
            usage: "help [command | command group]",
            examples: ["help", "help prefix"],
            guarded: true,
            args: [
                {
                    type: "group|command",
                    name: "command ",
                    key: "command",
                    prompt: "Which command or command group do you want details about?",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        var lang = await msg.guild.lang();
        var langCode = await msg.guild.settings.get("lang", "en");
        var langHelp = langs.get(langCode);
        const embed = newEmbed();
        let groups = msg.client.registry.groups;
        if(!cmd.command) {
            groups = groups
                .map(g => `- **${g.id}** (${g.name})`)
                .join("\n");
            embed
                .setTitle(lang.help.title)
                .setDescription(
                    lang.help.groups +
                    groups
                );
        } else if(cmd.command instanceof commando.CommandGroup) {
            const group = cmd.command;
            let commands = group.commands;
            if(!msg.client.isOwner(msg.author)) commands = commands.filter(c => !c.ownerOnly);
            commands = commands
                .filter(c => !c.hidden)
                // .forEach(c => embed.addField(c.name, c.description))
                .map(command => langHelp ? langHelp[command.name] || command : command)
                .map(c => `- **${c.name}** (${c.description})`)
                .join("\n");
            embed
                .setTitle(`${group.id} (${group.name})`)
                .setDescription(
                    lang.help.usage.replace("%s", msg.anyUsage(`${this.name} <command>`)) +
                    lang.help.available +
                    commands
                );
        } else {
            const requestedCommand = cmd.command;
            const command = langHelp ? langHelp[requestedCommand.name] || requestedCommand : requestedCommand;
            embed
                .setTitle(`${command.name} (${command.groupID ? command.groupID : command.group ? command.group : lang.help.default}) ${requestedCommand.guildOnly ? " " + lang.help.serverOnly : ""}${requestedCommand.nsfw && (command.group ? command.group !== "NSFW" : true) ? " " + lang.help.nsfw : ""}`)
                .setDescription(command.description)
                .addField(lang.help.format, `${msg.anyUsage(`${command.name}${command.format ? ` ${command.format}` : ""}`)}`);

            if(command.aliases.length) embed.addField(lang.help.aliases, command.aliases.join(", "));
            if(command.details) embed.addField(lang.help.details, command.details);
            if(command.args && !command.arguments) command.arguments = command.args; // just to make sure
            if(command.arguments) embed.addField(lang.help.arguments, command.arguments.map(arg => `\`${arg.key}\` - ${arg.prompt.substr(0, 1).toUpperCase() + arg.prompt.substr(1)} ${arg.default ? "(" + lang.help.defaultArg + " `" + arg.default + "`)" : ""}`).join("\n"));
            if(command.examples && command.examples.length > 0) embed.addField(command.examplesName || lang.help.examples, command.examples.map(e => `\`${e}\``).join("\n"));
        }

        msg.channel.send(embed);
    }
};
