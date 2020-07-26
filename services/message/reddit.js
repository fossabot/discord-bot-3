const newEmbed = require("../../embed");
const { timestampToDate } = require("../../utils");
const Service = require("../base");

module.exports = class RedditPreviewService extends Service {
    name = "reddit";
    load() {
        const r = global.reddit;
        if(!r) return;
        this.client.on("message", async msg => {
            if(/( |^)(u|r)\/[a-z0-9][a-z0-9_-]{2,21}/gi.test(msg.content)) {
                var f = msg.content.match(/(?= |^)(u|r)\/([a-z0-9][a-z0-9_-]{2,21})/gi);
                for(const e of f) {
                    const embed = newEmbed();

                    if(e.startsWith("u") || e.startsWith("U")) {
                        try {
                            var user = await r.getUser(e);
                        } catch(e) {
                            continue;
                        }
                        if(await user.over_18 && !msg.channel.nsfw) {
                            return;
                            // embed
                            //     .setDescription("NSFW users are not allow in non-NSFW channels!")
                            //     .setColor("RED")
                            //     .setFooter("");
                            // return msg.channel.send(embed);
                        };
                        const usub = await user.subreddit.display_name;
                        embed
                            .setTitle(usub.display_name_prefixed)
                            .setURL("https://reddit.com" + usub.url)
                            .setDescription(usub.public_description)
                            .setThumbnail(usub.icon_img)
                            .addField("Created", timestampToDate(await user.created, true), true)
                            .addField("Karma", `${(await user.link_karma).withCommas()} / ${(await user.comment_karma).withCommas()}`, true)
                            .addField("Reddit Premium", await user.is_gold, true)
                            .setImage(usub.banner_img);

                        if(await user.subreddit.display_name.title) {
                            embed.setTitle(await user.subreddit.display_name.title);
                            embed.footer.text += " - " + (await user.subreddit).display_name.display_name_prefixed;
                        };
                        msg.channel.send(embed);
                    } else {
                        try {
                            var sub = await r.getSubreddit(e);
                        } catch(e) {
                            continue;
                        }
                        if(await sub.over18 && !msg.channel.nsfw) {
                            return;
                            // embed
                            //     .setDescription("NSFW subreddits are not allow in non-NSFW channels!")
                            //     .setColor("RED")
                            //     .setFooter("");
                            // return msg.channel.send(embed);
                        };
                        embed
                            .setTitle(await sub.title)
                            .setURL("https://reddit.com" + await sub.url)
                            .setDescription(await sub.public_description)
                            .setThumbnail(await sub.icon_img)
                            .addField("Subscribers", (await sub.subscribers).withCommas(), true)
                            .setImage(await sub.banner_img)
                            .addField("Created", timestampToDate(await sub.created, true), true)
                            .setFooter(embed.footer.text + " | " + await sub.display_name_prefixed, embed.footer.iconURL);
                        msg.channel.send(embed);
                    }
                }
            }
        });
    }
};
