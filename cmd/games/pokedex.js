const got = require("got");
const newEmbed = require("../../embed");
const commando = require("@iceprod/discord.js-commando");

module.exports = class Poke extends commando.Command {
    constructor(client) {
        super(client, {
            name: "poke",
            memberName: "poke",
            group: "games",
            hidden: true,
            description: "Finds something in pokedex",
            usage: "poke help",
            args: [
                {
                    type: "string",
                    key: "cmd",
                    prompt: "Which subcommand to use? Use help to see available ones."
                },
                {
                    type: "string",
                    key: "poke",
                    prompt: "Pokemon to see",
                    default: ""
                }
            ]
        });
    }

    async run(msg, cmd) {
        this.cmd = cmd;
        this.msg = msg;
        this.processCommand(cmd);
    }

    processCommand(cmd) {
        switch(cmd.cmd) {
            case "mon":
                this.mon();
                break;
            case "help":
                this.help();
                break;
            default:
                this.msg.channel.send("Unknown subcommand. See `poke help`");
        }
    }

    mon() {
        if(!this.cmd.poke) {
            this.msg.channel.send("No pokemon to find specified. Usage: `poke mon <name>`");
            return;
        }
        try {
            got(`https://pokeapi.co/api/v2/pokemon/${this.cmd.poke.toLowerCase()}`).then(res => {
                var json = JSON.parse(res.body);
                var types = [];
                var type = json.types;
                type.forEach((item, i) => {
                    types.push(`**${(item.type.name[0].toUpperCase() + item.type.name.slice(1)).replace("-", " ")}**`);
                });
                var abils = [];
                var abil = json.abilities;
                abil.forEach((item, i) => {
                    abils.push(`**${(item.ability.name[0].toUpperCase() + item.ability.name.slice(1)).replace("-", " ")}**`); // lazy approch
                });

                var name = (json.name[0].toUpperCase() + json.name.slice(1)).replace("-", " ");
                /* First Embed - Normal Statistics */
                var embed = newEmbed();
                embed.setTitle(("000" + json.id).substr(-3) + " - " + name);
                embed.addField("Type", types.join("/"), true);
                embed.addField("Weight", json.weight, true);
                embed.addField("Height", json.height, true);
                embed.addField("Abilities", abils.join(", "));

                /* Second Embed - Picture */
                var embed2 = newEmbed();
                embed2.setTitle(`Picture of ${name}`);
                embed2.setImage(json.sprites.front_default);

                /* Third Embed - Shiny Picture */
                var embed3 = newEmbed();
                embed3.setTitle(`Picture of Shiny ${name}`);
                embed3.setImage(json.sprites.front_shiny);

                this.msg.channel.send(embed);
                this.msg.channel.send(embed2);
                this.msg.channel.send(embed3);
            });
        } catch(e) {
            var embed = newEmbed();
            embed.setTitle("Not Found");
            embed.setDescription(`Pokemon **${this.cmd.poke}** not found. Please note that our bot still not support Sword and Shield Pokemons`);
            this.msg.channel.send(embed);
        }
    }

    help() {
        this.msg.channel.send("The only currently working sub command is 'mon' which gets information about given pokemon.");
    }
};
