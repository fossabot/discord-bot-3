const {
    Structures
} = require("discord.js");

Structures.extend("TextChannel", (TC) => {
    return class TextChannel extends TC {
        sendFile(file) {
            return this.send({
                files: [file]
            });
        }
    };
});