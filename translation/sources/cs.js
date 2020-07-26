module.exports = {
    package: {
        not_found: {
            title: "Balíček nenalezen",
            desc: "Balíček %s nebyl nalezen"
        },
        publisher: "Vydavatel",
        maintainers: "Správci",
        stars: "Hvězdy"
    },
    general: {
        error: "Nastala chyba",
        author: "Autor",
        downloads: "Počet stažení",
        downloaded: "Staženo",
        title_open: "Klikněte na název pro otevření webu",
        not_found: "Nenalezeno",
        done: "Hotovo",
        failed: "Failed",
        search: "Výsledky hledání pro *%s*",
        sub: "Unknown subcommand. See `%s help`.",
        by: "Od %s",
        donor: "Dárce",
        donor_only: "Tento příkaz je dostupný pouze pro dárce.",
        tbd: "Již brzy",
        color: "Barva",
        color_invalid: "Špatná barva",
        perms: "Nemáte dostatečná práva pro tuto akci.",
        limit: "Prosím vyberte číslo mezi %s a %n",
        months: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "lis", "pro", "Dec"]
    },
    help: {
        title: "Pomoc",
        groups: "Dostupné skupiny příkazů:\n",
        usage: "Použij %s pro získání více informací o příkazu\n\n",
        available: "Dostupné příkazy v této skupině:\n",
        serverOnly: "(Pouze v serverech)",
        nsfw: "(18+)",
        default: "Essentials",
        arguments: "Argumenty",
        defaultArg: "Výchozí hodnota:",
        format: "Formát",
        aliases: "Aliasy",
        details: "Detaily",
        examples: "Příklady"
    },
    lang: {
        current: "Nastavený jazyk: `%s`"
    },
    docs: {
        props: "Vlastnosti",
        methods: "Metody"
    },
    ddg: {
        name: "Duck Duck Go",
        bang: "Bang",
        footer: " - Zdroj: DuckDuckGo",
        ia: "DDG Instantní odpověď",
        not_found: "Nic nenalezeno. Tohle může znamenat že DDG má odpověď ale bot ji nedokáže zpracovat."
    },
    eval: {
        exec: "Spouštění...",
        killed: "Program byl spuštěný moc dlouho, ukončeno",
        command: "Kód",
        eval_err: "Nastala chyba při spouštění kódu.",
        error: "An error occured.\nYou shouldn't ever receive an error like this.\nPlease contact TechmandanCZ#0135 in this server: https://discord.gg/dZtq4Qu",
        output: "Výstup"
    },
    dstatus: {
        latest: "Poslední incident",
        status: "Status"
    },
    format: {
        title: "Simple markdown",
        desc: "You can make your code and message more readable using simplified markdown:",
        bold: {
            title: "Bold text",
            desc: "Use 2 stars surrounding the text you want to make bold\n" +
            "\\*\\*Bold\\*\\*\n**Bold**"
        },
        italic: {
            title: "Italic text",
            desc: "Use **1** star surrounding the text you want to make italic\n" +
            "\\*Italic\\*\n*Italic*"
        },
        inline: {
            title: "Inline code",
            desc: "Use single backtick surrounding your code\n" +
            "\\`This is an example\\`\n`This is an example`"
        },
        multiline: {
            title: "Multiline code with code highlight",
            desc: "Use 3 backticks followed by the name of language you're using surrounding your code\n" +
            "\\```javascript\nlet example = \"this\"\n\\```\n```javascript\nlet example = \"this\"\n```"
        },
        share: {
            title: "Code sharing services",
            desc: "*If you want to share large chunks of code, you can use these:*\n" +
            "[codepen](https://codepen.io/) - Used for showing off front end things - supports emmet and CSS preprocessors\n" +
            "[jsfiddle](https://jsfiddle.net/) - A less distracting but just as powerful alternative to CodePen\n" +
            "[github](https://github.com/) - The ultimate code versioning, collaboration and management platform based on git"
        }
    },
    codes: {
        format: "Expected format `%scode <code>`. <code> must be number.",
        nice: "Nice",
        not_found: "Code %s wasn't found withing official or unnofficial HTTP status codes.",
        nonstandart: "(Not-standart)",
        footer: " - Description from wikipedia"
    },
    log: {
        title: "Log",
        command: "Command",
        args: "Arguments",
        msg: "Message"
    },
    php: {
        help: "Použij `%s php <class | function>` nebo `%s php <class>::<method>`. Používej OOP styl.",
        version: "Verze",
        syntax: "Syntaxe",
        long: "Příklad je moc dlouhý, klikni na titulek k otevření prohlížeče.",
        error: "Chyba",
        not_found: "%s nenalezeno"
    },
    request: {
        wait: "Performing request",
        results: "Request results:",
        code: "Response code",
        code_more: "%s (Don't understand the code? See `code %n`)",
        headers: "Headers",
        truncated: "%s truncated",
        cookies: "Cookies",
        long: "Response body is longer than discord's limit. The body below is truncated to fit.",
        response: "Response",
        parse_error: "An error occured during JSON parse:"
    },
    stackoverflow: {
        not_found: "Otázka nenalezena",
        truncated: " | Obsah zkrácen" // unlike other truncated message, this is shown at footer
    },
    nekos: {
        tos: "Some endpoints break discord ToS and are disallowed from public use.",
        sfw: "Non-existent command or NSFW. See `nekos help`.",
        nsfw: "Non-existent command or SFW. See `nekos help`.",
        see: "See %s for available subcommands. Use them as `nekos <cmd>` (SFW) or `nekos-lewd <cmd>` (NSFW)."
    },
    balance: {
        target_desc: "%u má %n BBS",
        desc: "Momentálně máš %n BBS"
    },
    mine: {
        done: "Úspěšně vytěženo. Momentálně máš %s BBS.",
        not_yet: "Zatím nemůžeš težit, zkus to ",
        error: "Nastala chyba."
    },
    pay: {
        self: "Posílání peněz sám sobě ti nijak nepomůže, jen ztratíš peníze kvůli poplatkům.",
        too_low: "Nedostatek BBS.",
        nothing: "Musíš něco poslat",
        done: "Odesláno!"
    },
    premium: {
        true: "Blahopřeji! Máš prémium, vyzkoušej nějaké příkazy!",
        false: "Nemáš prémium. Pro více informací běž na %s"
    },
    rich: {
        null: "Nikdo nic nemá. Buď první!",
        page_not_found: "Stránka nenalezena",
        title: "Nejbohatší uživatelé v **%s**",
        page: "Strana %n z %i"
    },
    achievements: {
        title: "Úspěchy",
        format: "**%s** [BBS: %f, XP: %n]",
        null: "Nemáš žádné úspěchy, zatím"
    },
    avatar: {
        not_found: "Uživatel nenalezen."
    },
    covid: {
        error: "Něco se pokazilo",
        country_not: "Zěme nenalezena",
        country: "Země",
        info: "COVID-19 Informace",
        cases: {
            total: "Celkem případů",
            new: "Nové případy",
            tdeaths: "Celkem úmrtí",
            ndeaths: "Nově úmrtí",
            trecovered: "Celkem uzdravení",
            nrecovered: "Nově uzdravení"
        },
        graph: "Graf posledních %n záznamů"
    },
    math: {
        error: "Daný výraz je špatně formulován"
    },
    oldest: {
        title: "Nejstarší uživatelé",
        users: "Uživatelé",
        pages: "nejstarší uživatelé"
    },
    reddit: {
        error: "Nastala chyba. Je tento subreddit veřejný?",
        disabled: "This command is currently disabled (globally).",
        conn: "Reddit connection not sucessful.",
        nsfw: "NSFW subreddits aren't allowed in non-nsfw channels.",
        subs: "Subscribers",
        created: "Created",
        not_found: "Subreddit not found",
        private: "This subreddit is private",
        banned: "This subreddit is banned",
        quarantined: "This subreddit is quarantined"
    },
    translate: {
        source: "Cílový jazyk nebo text není validní!",
        text: "Nepodařilo se přeložit do jazyka '%s'.",
        premium: "Vypadá to že zpráva obsahuje embed. Získejte premium a překládejte i embed."
    },
    voted: {
        true: "Již jsi hlasoval. Všechny příkazy které vyžadují hlasování jsou odemčené",
        false: "Ještě jsi nehlasoval. Můžeš tak učinit na %s"
    },
    cool: {
        cooling: "%s se ochlazuje"
    },
    cow: {
        long: "Moc dlouhá zpráva!"
    },
    joke: {
        type: "Couldn't find any joke of that type."
    },
    urban: {
        fetch: "Couldn't fetch definition",
        undefined: "Undefined",
        undef_desc: "This word isn't defined in Urban Dictionary",
        example: "Example",
        upvotes: "Thumbs Up"
    },
    happyfone: {
        nsfw: "This type is available only inside NSFW channels",
        title: "%s for you",
        error: "Cannot get image from Happy Fone API."
    },
    qr: {
        title: "QR Code",
        footer: " | Using danbulant.eu API"
    },
    xkcd: {
        today: "Today's comic"
    },
    mc: {
        skin: "An error occured. Does this minecraft account exist?"
    },
    announce: {
        color: "You passed invalid color, it will get ignored."
    },
    ban: {
        bot: "You can't ban this bot!",
        self: "You can't ban yourself!",
        botLow: "Bot cannot ban this user.",
        low: "You can't ban this user because you're not high enough in the role hierachy!",
        long: "Reason must be under 256 characters!",
        text: "Ban %n | Reason \"%s\"",
        mod: "Responsible moderator: %u\nUse `%scase %n` for more information"
    },
    kick: {
        bot: "You can't kick this bot!",
        self: "You can't kick yourself!",
        botLow: "Bot cannot kick this user.",
        low: "You can't kick this user because you're not high enough in the role hierachy!",
        long: "Reason must be under 256 characters!",
        text: "Kick %n | Reason \"%s\"",
        mod: "Responsible moderator: %u\nUse `%scase %n` for more information"
    },
    warn: {
        bot: "You can't warn this bot!",
        self: "You can't warn yourself!",
        low: "You can't warn this user because you're not high enough in the role hierachy!",
        long: "Reason must be under 256 characters!",
        text: "Warn %n | Reason \"%s\"",
        mod: "Responsible moderator: %u\nUse `case %n` for more information"
    },
    case: {
        removed: "**[REMOVED]**",
        title: "%s | case %n",
        offender: "Offender",
        reason: "Reason",
        moderator: "Responsible moderator:",
        not_found: "Case '%n' not found"
    },
    channels: {
        all: "All channels are currently allowed! :smile:",
        allowed: "Allowed Channels:",
        specify: "Please specify one or more channels!",
        no_all: "You can't disallow all channels"
    },
    count: {
        total: "%s Total users: %n",
        online: "%s Online users: %n",
        dnd: "%s DND users: %n",
        idle: "%s Idle users: %n",
        offline: "%s Offline users: %n",
        bots: "%s Bots: %n",
        dm: "We're the only one's in DMs"
    },
    editreason: {
        done: "✅ Successfully updated reason for case %n",
        not_found: "Case %n not found"
    },
    giveaway: {
        title: "Giveaway %s",
        footer: "React %s to join - %n",
        over: "Giveaway Over",
        winner: "Winner: %s",
        won: "%u has won %s! %c"
    },
    history: {
        title: "%u's offense history",
        field: "%s | Case %n",
        desc: "Reason: %s\nMod: %u",
        null: "User %u has no offense history. Good boy :smile:"
    },
    logs: {
        list: {
            title: "Logging channels:",
            found: "Found %n channels to log into:"
        },
        add: "New channel added with default settings",
        remove: "Removed the channel",
        not_found: "Channel isn't set as logging channel",
        alter: "Altered the channel",
        unknown: "Unknown operaiton with option %s, ignoring",
        view: "Logging channel `%s`"
    },
    purge: {
        done: "%s Successfully purge %n messages!"
    },
    removerwarn: {
        removed: "This warn has already been removed!",
        not_found: "Case %n not found",
        done: "%s Successfully removed warning from user %u"
    },
    role: {
        perms: "You can't manage this role!",
        perms_user: "You can't manage this user!",
        add: "Successfully added %r to %u",
        remove: "Successfully removed %r from %u"
    },
    stats: {
        title: "The most universal bot.",
        website: "Website",
        guild: "Main server",
        prefix: "Prefix",
        users: "Users",
        guilds: "Guilds",
        uptime: "Uptime",
        reload: "Last reloaded"
    },
    togglelevel: {
        done: "Toggled! Current state %s"
    },
    info: {
        channel: {},
        guild: {
            owner: "Owner",
            region: "Region",
            categories: "Categories",
            text: "Text Channels",
            voice: "Voice Channels",
            roles: "Roles",
            members: "Members",
            humans: "Humans",
            bots: "Bots",
            footer: " | Server Created %s"
        },
        help: {
            title: "Info",
            desc: "Get information about specified object/user. In format `info <type> <arg>",
            user: "Gets info about user (defaults to you)",
            role: "Gets info about specified role (no default)",
            channel: "Gets info about channel (defaults to current channel)",
            guild: "Gets info about this guild. Alias `server`."
        },
        role: {
            not_found: "Couldn't find role.",
            title: "Info about role %s",
            color: "Color",
            id: "ID",
            mentionable: "Mentionable",
            since: "Since"
        },
        user: {
            not_found: "Couldn't find that user %s",
            title: "User info",
            name: "Name",
            id: "ID",
            uuid: "UUID",
            donor: "Donor",
            level: "Level",
            xp: "XP",
            bbs: "BBS",
            offenses: "Offenses",
            bot: "Bot",
            registered: "Registered",
            roles: "Roles",
            online: "Online status:"
        }
    },
    music: {
        voice: {
            user_connection: "You're not in a voice channel!",
            bot_connection: "Bot is not connected to a voice channel!",
            joined: "The bot is already in a voice channel!",
            perms: "Couldn't join your voice channel. Make sure bot has permission to join."
        },
        jump: "Jumped to position %n",
        range: "The number of songs selected is out of limits.",
        playing: "Nothing's playing",
        fetch: "Couldn't fetch song info",
        pause: "Paused",
        paused: "Playback is already paused. User `resume` to continue playback.",
        queue: {
            name: "Queue",
            current: (len) => `Current queue (${len} song${len !== 0 ? "s" : ""})`,
            empty: "Queue is empty",
            pages: "music in queue"
        },
        removed: (len) => `Removed ${len} song${len !== 0 ? "s" : ""}`,
        resume: "Resumed",
        resumed: "Playback is already playing. Use `pause` to pause playback.",
        shuffled: (len) => `Shuffled ${len} song${len !== 0 ? "s" : ""}`,
        skip: (len) => `Skipped ${len} song${len !== 0 ? "s" : ""}`,
        volume: "Set volume to %n%%.",
        max_vol: "You can't set volume to more than %n%%",
        current: "Current volume is %n%%",
        stop: "Stopped music playback",
        player: {
            found: "Found %n videos, reply with number to choose",
            desc: "Command will be canceled after 30 seconds",
            added: "Added song to queue",
            nothing: "Nothing selected",
            likes: "Likes",
            requested: "Requested by",
            position: "Position in queue",
            length: "Length",
            volume: "Volume",
            time: "Current time",
            nothing_next: "Nothing to play next"
        }
    },
    booru: {
        not_found: "Couldn't find booru site with that subdomain."
    },
    pokemon: {
        missing: "No pokemon to find specified. Usage `poke mon <name>`",
        not_found: "No pokemon found. Double check the name '%s'",
        type: "Type",
        weight: "Weight",
        height: "Height",
        help: {
            text: "The only currently working sub command is `mon` which gets info about specified pokemon."
        }
    },
    virustotal: {
        true: {
            title: "Link was marked malicious by %n sources.",
            desc: "The page was scanned by VirusTotal by $n sources. Click the title for full report."
        },
        false: {
            title: "Link is safe.",
            desc: "The page was scanned by VirusTotal by $n sources. Click the title for full report."
        }
    },
    preview: {
        attachments: "Attachments",
        attachment_long: "Message has one attachment (not an image).",
        attachments_long: "Message has %n attachments",
        tts: "TTS",
        tts_long: "The message was sent as Text-To-Speech.",
        webhook: "Webhook",
        webhook_long: "The message was sent from webhook.",
        system: "System",
        system_long: "The message was sent as system message by Discord.",
        pinned: "Pinned",
        pinned_long: "The message has been pinned in the channel.",
        hit: "Hit",
        hit_long: "The message is a hit in a search",
        deleted: "Deleted",
        deleted_long: "The message has been deleted",
        edited: "Edited",
        edited_long: "The message has been edited",
        deleted_content: "[DELETED]"
    }
};
