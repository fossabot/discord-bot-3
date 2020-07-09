
const newEmbed = require("../../../embed");

module.exports = msg => {
    var embed = newEmbed()
        .setTitle("Info")
        .setDescription("Gets information about specified object/user. In format `ice info <type> <arg>`")
        .addField("`user`", "Gets info about user (defaults to you)")
        .addField("`role`", "Gets info about specified role (no default)")
        .addField("`channel`", "Gets info about channel (defaults to current channel)")
        .addField("`guild`", "Gets info about this guild. Alias: `server`");
    msg.channel.send(embed);
};
