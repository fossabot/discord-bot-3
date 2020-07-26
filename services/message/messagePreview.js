const newEmbed = require("../../embed");
const Service = require("../base");

module.exports = class MessagePreviewService extends Service {
    name = "messagepreview";
    load() {
        this.client.on("message", async (msg) => {
            if(msg.author.bot) return;
            if(!/https:\/\/discord(app)?\.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+(?: [\s\S]*){0,1}/.test(msg.content)) { return; }

            var [,,,, server, channel, message] = msg.content.match(/(https:\/\/discorda?p?p?\.com\/channels\/[0-9]+\/[0-9]+\/[0-9]+)(?: [\s\S]*){0,1}/)[1].split("/");
            message = message.split(" ")[0];

            try {
                server = msg.client.guilds.resolve(server);
                channel = server.channels.resolve(channel);
            } catch(e) {
                return;
            }

            var embed;
            try {
                var mess = await channel.messages.fetch(message);

                if(!mess) return;

                embed = newEmbed();
                embed.description = mess.cleanContent;
                embed.setAuthor(mess.author.tag, mess.author.avatarURL());

                if(mess.attachments.size) {
                    if(mess.attachments.size === 1) {
                        for(var [, attachment] of mess.attachments) {
                            if(attachment.width) {
                                embed.setImage(attachment.proxyURL || attachment.url);
                            } else {
                                embed.addField("Attachments", "Message has one attachment (not an image).");
                            }
                        }
                    } else {
                        embed.addField("Attachments", `Message has ${mess.attachments.size} attachments.`);
                    }
                }

                if(mess.tts) {
                    embed.addField("TTS", "The message was sent as Text-To-Speech.");
                }

                if(mess.webhookID) {
                    embed.addField("Webhook", "The message was sent from webhook.");
                }

                if(mess.system) {
                    embed.addField("System", "The message was sent as system message by Discord.");
                }

                if(mess.pinned) {
                    embed.addField("Pinned", "The message has been pinned in the channel.");
                }

                if(mess.hit) {
                    embed.addField("Hit", "The message is a hit in a search");
                }

                if(mess.deleted) {
                    embed.addField("Deleted", "The message has been deleted");
                    embed.setDescription("[DELETED]");
                }

                if(mess.edited) {
                    embed.addField("Edited", "The message has been edited");
                }

                try {
                    msg.channel.send(embed);
                } catch(e) {}
            } catch(e) {
                embed = newEmbed();

                embed.setAuthor("[DELETED]", "http://icon-library.com/images/yellow-discord-icon/yellow-discord-icon-24.jpg");
                embed.setDescription("[DELETED]");

                embed.addField("Deleted", "The message has been deleted.");

                try {
                    msg.channel.send(embed);
                } catch(e) {}
            }
        });
    }
};
