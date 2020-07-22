const path = require("path");

delete require.cache[path.join(__dirname, "guild.js")];
delete require.cache[path.join(__dirname, "member.js")];
delete require.cache[path.join(__dirname, "textChannel.js")];
delete require.cache[path.join(__dirname, "user.js")];
require("./guild");
require("./member");
require("./textChannel");
require("./user");
