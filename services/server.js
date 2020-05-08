const express = require("express");
const httpCodeInfo = require("../managers/httpCodeInfo");
const app = express();

var client = null;

app.use(express.json());

app.get("/code/:code", (req, res) => {
    res.json(httpCodeInfo(req.params.code));
});

app.get("/stats", (req, res) => {
    res.json({
        guilds: client.guilds.length
    });
});

app.get("/guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.id);
    if(guild) {
        res.json(guild);
    } else {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/guild/:id/permission/:permission", (req, res) => {
    var guild = client.guilds.resolve(req.params.id);
    if(guild) {
        res.json(guild.me.hasPermission(req.params.permission));
    } else {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/member/:guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.guild);
    if(guild) {
        var member = guild.member(req.params.id);
        var user = client.users.resolve(req.params.id);
        if(member) {
            res.json({
                member,
                user
            });
        } else {
            res.status(404).json({
                error: "not_found"
            });
        }
    } else {
        res.status(404).json({
            error: "guild_not_found"
        });
    }
});

app.get("/channel/:guild/:id", (req, res) => {
    var guild = client.guilds.resolve(req.params.guild);
    if(guild) {
        var channel = guild.channels.resolve(req.params.id);
        if(channel) {
            res.json(channel);
        } else {
            res.status(404).json({
                error: "not_found"
            });
        }
    } else {
        res.status(404).json({
            error: "guild_not_found"
        });
    }
});

app.get("/message/:guild/:channel/:id", async (req, res) => {
    try {
        var guild = client.guilds.resolve(req.params.guild);
        var channel = guild.channels.resolve(req.params.channel);
        var message = await channel.messages.fetch(req.params.id);
        res.json(message);
    } catch(e) {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.post("/message/:guild/:channel", async (req, res) => {
    try {
        var guild = client.guilds.resolve(req.params.guild);
        var channel = guild.channels.resolve(req.params.channel);
    } catch(e) {
        return res.status(404).json({
            error: "not_found"
        });
    }
    try {
        console.log(req.body);
        var msg = await channel.send(req.body);
        res.json(msg);
    } catch(e) {
        console.log(e);
        return res.status(403).json({
            error: "send_permission"
        });
    }
});

app.get("/user/:id", (req, res) => {
    var user = client.users.resolve(req.params.id);
    if(user) {
        user.avatar_url = user.displayAvatarURL();
        res.json(user);
    } else {
        res.status(404).json({
            error: "not_found"
        });
    }
});

app.get("/", (req, res) => {
    res.write(new Date().toJSON());
    res.end();
});

app.listen(8856, () => {
    console.log("[SERVER] Internal server ready");
});

module.exports = (cl) => {
    client = cl;
};
