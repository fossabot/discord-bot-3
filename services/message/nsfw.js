module.exports = null;

/*
const got = require("got");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");
const newEmbed = require("../../embed");

var model;

const minValues = {
    neutral: Infinity,
    drawing: Infinity,
    sexy: Infinity,
    hentai: 0.5,
    porn: 0.5
};

module.exports = async (msg) => {
    if(!msg.attachments.size) return;

    if(!model) {
        model = await nsfw.load();
    }

    for(const [, attachment] of msg.attachments) {
        const pic = await got(attachment.proxyURL, {
            responseType: "buffer"
        });
        const image = await tf.node.decodeImage(pic.body, 3);
        const predictions = await model.classify(image);
        image.dispose();

        var map = new Map();

        for(var prediction of predictions) {
            map.set(prediction.className.toString().toLowerCase(), prediction.probability);
        }

        var isDangerous = false;
        for(var min in minValues) {
            if(map.get(min) > minValues[min]) {
                isDangerous = {
                    name: min,
                    value: map.get(min)
                };
            }
        }

        if(isDangerous && !msg.channel.nsfw) {
            await msg.delete();
            var embed = newEmbed();
            embed.setTitle(`NSFW Detected (${isDangerous.name} ${Math.round(isDangerous.value * 100)}%)`);
            embed.setAuthor(msg.author.tag, msg.author.avatarURL());
            embed.setDescription("Image detected as NSFW. Click the title to view the image (NSFW!).");
            embed.setURL(attachment.proxyURL);
            msg.channel.send(embed);
        }
    }
};
*/
