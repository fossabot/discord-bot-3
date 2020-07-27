const newEmbed = require("../../../embed");
const { timestampToDate } = require("../../../utils");

function getRegion(region) {
    switch(region) {
        case "europe":
            return ":flag_eu:";
        case "brazil":
            return ":flag_br:";
        case "hong_kong":
            return ":flag_hk:";
        case "india":
            return ":flag_in:";
        case "japan":
            return ":flag_jp:";
        case "russia":
            return ":flag_ru:";
        case "singapore":
            return ":flag_sg";
        case "south_africa":
            return ":flag_za:";
        case "sydney":
            return ":flag_au:";
        case "us_central":
        case "us_east":
        case "us_south":
        case "us_west":
            return ":flag_us:";
    }
    return "";
}

module.exports = async (msg, cmd) => {
    const embed = newEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setTitle(msg.guild.name)
        .setThumbnail(msg.guild.iconURL({ dynamic: true }))
        .addField("Owner", "<@!" + msg.guild.owner + "> :sunglasses:", true)
        .addField("Region", msg.guild.region + " " + getRegion(msg.guild.region), true)
        .addField("Categories", msg.guild.channels.cache.filter(c => c.type === "category").size + " :notepad_spiral:", true)
        .addField("Text Channels", msg.guild.channels.cache.filter(c => c.type === "text").size + " :scroll:", true)
        .addField("Voice Channels", msg.guild.channels.cache.filter(c => c.type === "voice").size + " :microphone2:", true)
        .addField("Roles", msg.guild.roles.cache.size + " :ticket:", true)
        .addField("Members", msg.guild.members.cache.size + " :bust_in_silhouette:", true)
        .addField("Humans", msg.guild.members.cache.filter(m => !m.user.bot).size + " :adult:", true)
        .addField("Bots", msg.guild.members.cache.filter(m => m.user.bot).size + " :robot:", true);
        if(await msg.guild.isPremium()) embed.addField("Premium", "Level: " + await msg.guild.isPremium());
    if(msg.guild.bannerURL()) embed.setImage(msg.guild.bannerURL({ dynamic: true }));
    embed.setFooter(`${embed.footer.text} | Server Created: ${timestampToDate(msg.guild.createdTimestamp)}`);
    return msg.embed(embed);
};
