const ytdl = require("ytdl-core");
const got = require("got");

// eslint-disable-next-line
const Discord = require("discord.js"); // Used for JSDoc
const newEmbed = require("../../embed");
const config = require("../../config.json");

const defaultOptions = {
    quality: "highestaudio"
};

class Player {
    /**
     * @param {Discord.Guild} guild
     */
    constructor(guild) {
        this.guild = guild;
    }

    /**
     * @returns {object[]} queue
     */
    async getQueue() {
        return await this.guild.settings.get("music.queue", []);
    }

    /**
     * @returns {Number}
     */
    async getPlayingId() {
        return await this.guild.settings.get("music.playing", -1);
    }

    /**
     * @returns {Object}
     */
    async getPlaying() {
        return await this.getQueue()[await this.getPlayingId()];
    }

    /**
     * @param {Number} playing
     */
    async setPlaying(playing) {
        return await this.guild.settings.set("music.playing", playing);
    }

    /**
     * @returns {Number} volume
     */
    async getVolume() {
        return await this.guild.settings.get("music.volume", 100);
    }

    /**
     * @param {Discord.Guild} guild
     * @param {Number} vol volume
     */
    async setVolume(vol) {
        if(this.guild.voice.connection.dispatcher) {
            this.guild.voice.connection.dispatcher.setVolume(vol);
        }
        return await this.guild.settings.set("music.volume", vol);
    }

    /**
     * Shuffles queue
     */
    async shuffleQueue() {
        return this.guild.settings.set(
            "music.queue",
            this.shuffleArray(await this.getQueue())
        );
    }

    /**
     * Shuffles array in place
     * @param {Array} a items to shuffle
     * @return {Array} shuffled
     */
    shuffleArray(a) {
        for(let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            if(i === j) continue;
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * @param {String} search
     * @returns {Object[]}
     */
    async listVideos(search) {
        var res = await got(
            "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=" +
                config.youtube.token +
                "&q=" +
                search
        );
        var results = JSON.parse(res.body).items;
        results = results.map((r) => {
            return { ...r.snippet, ...r.id };
        });
        return results;
    }

    /**
     * @param {Discord.Message} msg
     * @param {String} url
     * @return {void}
     */
    async play(msg, url) {
        var guild = msg.guild;
        if(!guild.voice) {
            throw new Error("not_connected");
        }

        var queue = await this.getQueue(guild);
        if(ytdl.validateURL(url) || ytdl.validateID(url)) {
            queue.push({
                url,
                requested: msg.author.id,
                data: await ytdl.getInfo(url)
            });
            return await guild.settings.set("music.queue", queue);
        } else if(
            url.match(
                /((https*:\/\/)*(www\.)*)youtube\.com\/playlist\?list=[A-Za-z0-9-_]{34}\.*/
            )
        ) {
            var playListId = url.match(/[A-Za-z0-9-_]{34}/)[0];
            try {
                var res = await got(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=10&playlistId=${playListId}&key=${config.youtube.token}`
                );

                var playlistItems = JSON.parse(res.body).items;

                for await(const playListItem of playlistItems) {
                    var playListItemUrl = `https://www.youtube.com/watch?v=${playListItem.contentDetails.videoId}`;
                    queue.push({
                        url: playListItemUrl,
                        requested: msg.author.id,
                        data: await ytdl.getInfo(playListItemUrl)
                    });
                }

                return await guild.settings.set("music.queue", queue);
            } catch(e) {
                console.error(e);
            }
        } else {
            var possibles = await this.listVideos(url);
            await guild.settings.set("music.stash", possibles);
            var embed = newEmbed();
            embed.setTitle(
                `Found ${possibles.length} videos, reply with number to select:`
            );
            embed.setDescription("Command will be canceled after 30 seconds");

            for(var num in possibles) {
                embed.addField(parseInt(num) + 1, possibles[num].title);
            }

            var sent = await msg.channel.send(embed);

            var collector = msg.channel.createMessageCollector(
                (m) => {
                    var filter =
                        // eslint-disable-next-line eqeqeq
                        parseInt(m.content.trim()) == m.content.trim() &&
                        m.author.id === msg.author.id;
                    return filter;
                },
                { time: 30000 }
            );

            var selected = null;

            collector.on("collect", async (m) => {
                selected = m.content;
                collector.stop("collected");
                var stash = await guild.settings.get("music.stash");
                var url = stash[selected - 1];
                if(!url) {
                    return msg.channel.send(
                        "Number is out of range (1-" + stash.size + ")"
                    );
                }
                await guild.settings.set("music.stash", []);
                var queue = await this.getQueue(guild);

                while(true) {
                    try {
                        var data = await ytdl.getInfo(url.videoId);
                        break;
                    } catch(e) {}
                }

                queue.push({
                    url: url.videoId,
                    requested: msg.author.id,
                    data
                });
                await guild.settings.set("music.queue", queue);
                embed.fields = [];
                embed.addField(selected, stash[selected - 1].title);
                embed.setDescription("");
                embed.setTitle("Added song to queue");

                sent.edit(embed);

                this.channel = msg.channel;

                await this.startPlaying(guild);
            });

            collector.on("end", async () => {
                if(!selected) {
                    var embed = newEmbed();
                    embed.setTitle("Nothing selected");
                    sent.edit(embed);
                }
            });
        }
    }

    /**
     * @param {Object} param0 data
     * @param {Boolean} np is playing now?
     * @param {Number} pos position
     */
    getEmbed({ data, url, requested }, np = false, pos) {
        var embed = newEmbed();

        embed.setTitle(data.title);
        embed.setAuthor(
            data.author.name,
            data.author.avatar,
            data.author.channel_url
        );
        embed.setURL(data.video_url);

        embed.addField(
            "Likes",
            `${data.likes} :+1: / ${data.dislikes} :-1:`,
            true
        );
        embed.addField("Requested by", `<@!${requested}>`, true);
        if(pos) embed.addField("Position in queue", pos, true);

        function humanReadable(sec) {
            var pad = (x) => x.toString().padStart(2, "0");
            var res = "";
            if(Math.floor(sec / (60 * 60)) > 0) {
                res += pad(Math.floor(sec / (60 * 60))) + ":";
            }
            res += pad(Math.floor((sec / 60) % 60)) + ":";
            res += pad(Math.floor(sec % 60));
            return res;
        }

        if(np && this.guild.voice) {
            if(this.guild.voice.connection) {
                if(this.guild.voice.connection.dispatcher) {
                    embed.addField(
                        "Current time",
                        humanReadable(
                            this.guild.voice.connection.dispatcher.streamTime /
                                1000
                        ),
                        true
                    );
                    embed.addField(
                        "Length",
                        data.length_seconds > 0
                            ? humanReadable(data.length_seconds)
                            : "LIVE",
                        true
                    );
                    embed.addField(
                        "Volume",
                        `${
                            this.guild.voice.connection.dispatcher.volume * 100
                        }%`,
                        true
                    );
                } else {
                    embed.addField(
                        "Length",
                        humanReadable(data.length_seconds)
                    );
                }
            } else {
                embed.addField("Length", humanReadable(data.length_seconds));
            }
        } else {
            embed.addField("Length", humanReadable(data.length_seconds));
        }

        var thumbnails = data.player_response.videoDetails.thumbnail.thumbnails;
        embed.setImage(thumbnails[thumbnails.length - 1].url);

        embed.setTimestamp();
        return embed;
    }

    /**
     * Starts playing music if queue is not empty
     */
    async startPlaying() {
        var npid = await this.getPlayingId();
        var queue = await this.getQueue();
        if(npid === -1) {
            if(queue.length === 0) return;
            npid = 1;
        }
        var np = queue[npid];
        await this.guild.settings.set("music.playing", npid);

        if(!this.guild.voice.connection) {
            this.guild.voice.channel.join();
        }
        if(!this.guild.voice.connection.dispatcher) {
            var dispatcher = this.guild.voice.connection.play(
                ytdl(np.data.video_url, defaultOptions)
            );
            dispatcher.setVolume(
                await this.guild.settings.get("music.volume", 1)
            );
            this.dispatch(dispatcher);
        }
    }

    /**
     * @param {Discord.StreamDispatcher} dispatcher
     */
    dispatch(dispatcher) {
        // var finished = false;
        dispatcher
            .on("start", async () => {
                if(this.channel) {
                    var npid = await this.getPlayingId();
                    var queue = await this.getQueue();

                    if(this.lastInfo)this.lastInfo.delete();

                    this.lastInfo = await this.channel.send(
                        this.getEmbed(queue[npid], true, npid)
                    );
                    /*
                    if(this.lastInfo) {
                        this.lastInfo.edit(this.getEmbed(queue[npid], true, npid));
                    } else {
                        this.lastInfo = await this.channel.send(this.getEmbed(queue[npid], true, npid));
                    }

                    /* var i;
                    i = setInterval(() => {
                        if(finished) { return clearInterval(i); }
                        if(!this.lastInfo) { return clearInterval(i); }
                        if(this.lastInfo.deleted) { return clearInterval(i); }
                        this.lastInfo.edit(this.getEmbed(queue[npid], true));
                    }, 2000); */
                }
            })
            .on("finish", async () => {
                // finished = true;
                try {
                    await this.skip(1);
                } catch(e) {
                    this.guild.voice.channel.leave();
                    if(this.channel) {
                        this.channel.send("Nothing to play next");
                    }
                }
            });
    }

    /**
     * @param {Number} num to jump to
     */
    async jump(num) {
        var npid = await this.getPlayingId();
        var queue = await this.getQueue();
        if(queue.length === 0) return;
        npid = parseInt(num);

        if(npid < 0 || npid > queue.length) {
            throw new Error("range");
        }
        var np = queue[npid];

        await this.guild.settings.set("music.playing", npid);

        if(!this.guild.voice.connection) {
            await this.guild.voice.channel.join();
        }

        var dispatcher = this.guild.voice.connection.play(
            ytdl(np.data.video_url, defaultOptions)
        );
        dispatcher.setVolume(await this.guild.settings.get("music.volume", 1));
        this.dispatch(dispatcher);
        return dispatcher;
    }

    /**
     * @param {Number} num to skip
     */
    async skip(num) {
        var npid = await this.getPlayingId();
        var queue = await this.getQueue();
        if(npid === -1) {
            if(queue.length === 0) return;
            npid = num;

            if(npid < 0 || npid > queue.length) {
                throw new Error("range");
            }
        } else {
            npid = parseInt(npid) + parseInt(num);

            if(npid < 0 || npid > queue.length) {
                throw new Error("range");
            }
        }
        var np = queue[npid];

        await this.guild.settings.set("music.playing", npid);

        if(!this.guild.voice.connection) {
            await this.guild.voice.channel.join();
        }

        var dispatcher = this.guild.voice.connection.play(
            ytdl(np.data.video_url, defaultOptions)
        );
        dispatcher.setVolume(await this.guild.settings.get("music.volume", 1));
        this.dispatch(dispatcher);
        return dispatcher;
    }

    /**
     * Pauses playback
     */
    async pause() {
        if(!this.guild.voice.connection.dispatcher) {
            throw new Error("no_conn");
        }
        return this.guild.voice.connection.dispatcher.pause(true);
    }

    /**
     * checks if playback is paused
     */
    isPaused() {
        return this.guild.voice.connection.dispatcher.paused;
    }

    /**
     * resumes playback
     */
    async resume() {
        if(!this.guild.voice.connection.dispatcher) {
            throw new Error("no_conn");
        }
        return this.guild.voice.connection.dispatcher.resume();
    }
}

module.exports = Player;
