const {
    Structures
} = require("discord.js");
const newEmbed = require("../embed");

Structures.extend("GuildMember", (GM) => {
    return class GuildMember extends GM {
        /**
         * Bans user from guild
         * @param {Object} param0
         */
        async ban({
            reason,
            days,
            author
        }) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "ban",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const embed = newEmbed();
            embed.setColor("RED");
            embed.setAuthor(`Ban ${Case.id}"`, author.avatarURL());
            embed.setTitle("You were banned in " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            await this.send(embed);

            return super.ban({
                reason,
                days
            });
        }

        /**
         * Kicks user from guild
         * @param {string} reason
         * @param {any} author
         */
        async kick(reason, author) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "ban",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const embed = newEmbed();
            embed.setColor("RED");
            embed.setAuthor(`Kick ${Case.id}"`, author.avatarURL());
            embed.setTitle("You were kicked from " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            this.send(embed);

            return super.kick(reason);
        }

        /**
         * Warns user
         * @param {string} reason
         * @param {any} author
         */
        async warn(reason, author) {
            // Set number of total cases in the server
            let totalCaseCount = await this.guild.settings.get("totalcasecount", 0);
            totalCaseCount++;
            await this.guild.settings.set("totalcasecount", totalCaseCount);

            // Store details about this case
            const Case = {
                id: totalCaseCount,
                type: "warn",
                offender: this.user.tag,
                offenderID: this.user.id,
                moderator: author.tag,
                moderatorID: author.id,
                reason: reason,
                removed: false
            };

            await this.guild.settings.set(`case.${Case.id}`, Case);

            const warnCount = this.guild.settings.get(`warns.${this.user.id}`, 1);
            await this.guild.settings.set(`warns.${this.user.id}`, warnCount + 1);

            const embed = newEmbed();
            embed.setColor("GOLD");
            embed.setAuthor(`Warn ${Case.id}`, author.avatarURL());
            embed.setTitle("You were warned in " + this.guild.name + " by " + Case.moderator);
            embed.setDescription(" > " + reason);
            await this.send(embed);

            return this;
        }
    };
});