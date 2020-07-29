# Aztec

![Formatted](https://github.com/iceproductions/discord-bot/workflows/CI/badge.svg)
[![HitCount](http://hits.dwyl.com/iceproductions/discord-bot.svg)](http://hits.dwyl.com/iceproductions/discord-bot)
![David](https://img.shields.io/david/iceproductions/discord-bot)
![GitHub](https://img.shields.io/github/license/iceproductions/discord-bot)
![Discord](https://img.shields.io/discord/689693889640398901)
![GitHub forks](https://img.shields.io/github/forks/iceproductions/discord-bot)
![GitHub contributors](https://img.shields.io/github/contributors/iceproductions/discord-bot)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ficeproductions%2Fdiscord-bot.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Ficeproductions%2Fdiscord-bot?ref=badge_shield)

[![Discord Bots](https://top.gg/api/widget/654725534365909043.svg)](https://top.gg/bot/654725534365909043)

<!-- <a href="https://discordbotlist.com/bots/654725534365909043">
    <img
        width="380"
        height="140"
        src="https://discordbotlist.com/bots/654725534365909043/widget"
        alt="Aztec stats on Discord Bot List" />
</a> -->

## About

Universal discord bot to suite all of your needs.

Want to use Aztec? Invite link can be found on Aztec's [website](http://aztec.bot).

## Setting up

The setup is quite simple:

* Grab latest release and extract the contents somewhere on the disk
* Install dependencies (See [#dependencies](#dependencies))
* Aquire token (from [discord developer portal](https://discordapp.com/developers)) and save it in config.json as token
* Create `managers/mysql.js` that exports pool (see [wiki](https://github.com/danbulant/ice-bot/wiki/Setting-up-database))
* Create MySQL databse with correct tables. (See [wiki](https://github.com/danbulant/ice-bot/wiki/Setting-up-database))
* (optional) Setup [scripts](#scripts)
* Start the bot (with `node .`)

Then optionaly if you want to have link checking, add `virustotal` field into config.json containing VirusTotal api key.

## Scripts

Scripts are used for working with system from bot, most notably the `update` functionality. For most part, just create folder `scripts` and put `update.sh` in it with contents `git pull`. It's made separately to allow implementing custom update functions, like downloading latest release or updating bot and other services running on server.

## Dependencies

* Node (Tested with v12 & v13. Running on another version? Let us know!)
* NPM (bundled with Node on modern releases)
* Deno - Use as new version as possible. Needs to be installed by same user as the one running bot.
* *(optional)* Git (or even better, hub) for simple updates - run one command and your bot is up to date

### Node dependencies

Those are installed with `npm i` automatically.
**Note: these aren't all dependencies, for list of all, see `package.json`**

* discord.js -> discord library ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/discord.js)
* @iceprod/discord.js-commando -> the framework we use ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/@iceprod/discord.js-commando)
* discord.js-docs -> searches through documentation ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/discord.js-docs)
* pacote -> searches through npm registry ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/pacote)
* cowsay -> a library for cowsay command ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/cowsay)
* eventemitter3 -> better event emitter class ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/eventemitter3)
* got -> because request **got** deprecated ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/got)
* javascript-time-ago -> yes, we are lazy to reinvent the wheel ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/javascript-time-ago)
* mysql2 -> connection to MySQL ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/mysql2)
* nekos.life -> Cute ~~catgirls~~ nekos ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/nekos.life)
* node-html-parser & cheerio -> because not every website has an API ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/node-html-parser) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/cheerio)
* pokedex-promise-v2 -> Promises for pokedex ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/pokedex-promise-v2)
* unique-random-array -> for our reddit command ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/unique-random-array)
* vm2 -> secure VM for code evaluation ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/vm2)
* singleline -> allows multiline strings ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/singleline)
* ffmpeg -> music playback coder ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/ffmpeg)
* ytdl-core -> for music playback ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/ytdl-core)
* figlet -> for rendering `ascii` command ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/iceproductions/discord-bot/figlet)

## Non-command related features

### Message previews

Messages can be previewed by sending a link to it. If Aztec has access to the server and channel the message was in, it will send an embed containing information about the message.

### Link scanning

Bot can be configured to test links via virustotal. API key required.

### Reddit

Sending u/name or r/subreddit will result in small embed as preview being sent.

## Commands

The bot has as of now the following commands

### Anime

* **konachan** - Safe version of konachan
* **nekos \<endpoint>** - Wrapper to nekos-dot-life API (SFW)
* **safebooru** - It's safe, but just to make sure...
* **sofurry** - Gives random image from sofurry. Please don't use this in non-furry servers
* **waifu** - Random AI-generated waifu + story

### Balance

This category is yet to be done.

* **balance** - shows current balance of user
* **mine** - Mines the daily amount. Can be called every 12 hours.
* **pay \<amount> \<who>** - Sends \<amount> to \<who>. Target must be in same server.
* **premium** - Shows if you have premium access or not
* **rich** - Shows richest users in guild.

### Dev

This category is for developers who are working on discord. Hope it helps!

* **apm** - Gets information of Atom Text Editor Package
* **bang** (alias **ddg**) - Sends info from `duckduckgo` instant answer or link from `bang`
* **chart** - Visualizes chart data, uses quickchart.io
* **color** - Shows color.
* **deno** - Full deno runtime. Limit of 15 seconds. Only network allowed.
* **djs** - Searches through Discord.js documentation
* **dstatus** - Shows status of discord servers
* **eval** - Evaluates given JS code. Has a limit of 10 seconds, running in NodeVM without access to require.
* **format** - Formatting guide
* **google** - Google it!
* **code** - Shows information about given HTTP code. Supports some non-official ones. *Thanks Wikipedia!*
* **logme** - Shows message metadata in JSON format.
* **npm** - Gets information about given package
* **php** - Searches through PHP documentation
* **phpeval** - Evaluates given PHP expression
* **pip** - Searches through pip (python's package manager)
* **renderhtml** - Renders given URL in chrome and sends output as image
* **request** (alias `req`)- Makes request. See `req help`
* **stackoverflow** (alias `so`) - Searches in SO and shows both question and answer

### Essentials

* **achievments** - Shows which achievments you currently own
* **avatar** - Shows your or someone else's (Ping 'em!) high-res avatar
* **boost** - Boosts server, allowing use of music in given server
* **covid** - Shows covid statistics
* **fact** - Gets a random fact
* **flags** (alias `badges`)- Shows user flags
* **invite** - Link to invite the bot
* **math** (alias `calc` or `calculate`) - Calculates given math expression and returns the result. See [mathjs.org](https://mathjs.org)
* **oldest** - Shows list of users ordered by the time of registration at discord
* **puppy** - Because everyone likes images of puppies
* **reddit** - Shows random image from given subreddit. If not on image-only subreddit, bot may **not** reply as of now.
* **translate** (alias `t`)- Translates text to given language. Defaults to EN and last message.
* **unboost** - Removes all boosts from guild casted by user.
* **voted** (Alias `vote`) - Checks status of user vote and if user didn't vote, shows link.

### Fun

* **ascii** (alias `figlet`) - Figlet text, also known as ascii-art text
* **clap** - Clapify given message
* **cool** - Cools something
* **cow** - The original cowsay/cowthink
* **cowsay** - Make cow say or think text
* **dab** - <o/
* **joke** - Random joke of given type. If no type provided, uses random
* **leet** Leetify message
* **lenny** - Everyone knows what's lenny
* **reddituser** (alias `ru`) - Shows info about reddit user (disabled until fixed)
* **say** - Make the bot say anything you want
* **spoiler** - Annoying spoilers
* **subinfo** (alias `sub`) - Shows info about reddit subreddit
* **urban** [alias **ud**] - Find the meaning in the Urban Dictionary
* **vaporwave** - Vaporify string

### Games

* **osuuser** (alias `ou`) - Shows info about osu user
* **pokedex** (alias `poke`) - Pokemon commands, see `poke help`
* **skin** - Shows minecraft skin of given player.

### Image

* **fone** - Uses happyfone API
* **meme** - Generates memes. Usage: `meme <photo/link to avatar> [top text] [bottom text]`
* **qr** (alias `qrcode`) - Generates QR Code from given text
* **xkcd** - Shows todays xkcd comic

### Mod

* **announce** - Make an announcement in the same channel. Admin only.
* **ban** - Bans user
* **case** - Shows info about case (warn/kick/ban).
* **channels** (alias `allow-channels`) - Allows usage of bot only in specified channels.
* **clearsettings** - Clears bot data about current server. **THIS ACTION IS IRREVERSIBLE**
* **count** - Counts members
* **giveaway** - Starts a giveaway
* **history** - Shows users history (kicks/bans/warns).
* **info** - Info about given resource.
* **kick** - Kicks user from the server
* **language** (alias `lang`) - Changes server language
* **logs** - Logs settings, not yet done.
* **poll** - Creates a new poll, 30 minutes for free users, 120 (2 hours) for premium users. Generates chart on each change.
* **profile** - Shows user profile.
* **purge \<x> \<delete report (true/false)>** - Purges last `x` messages
* **reason** (alias `editreason`) - Edits reason about specified case
* **removewarn** - Removes warning from user
* **role** - Manages roles. See help.
* **stats** - Stats of Aztec bot
* **subscribe \<guild> \<channel>** - Subscribes to given channel from guild. (Note: the channel must be set as subscribeable first)
* **toggle-level** - Toggles level up messages.
* **unsubscribe \<guild> \<channel>** - Unsubscribes from given channel and guild.
* **warn** - Warns user

### Music

This command requires guild to be boosted

* **join** - Joins the bot to voice channel you are currently in.
* **jump** - Jumps to selected position in queue.
* **leave** - Leaves the voice channel
* **now** - Shows currently playing song
* **pause** - Pauses playback
* **play** - Starts playing queue
* **queue** - Views current queue
* **remove** - Removes song from queue
* **resume** - Resumes playback
* **shuffle** - Shuffles queue
* **skip** - Skips current song (accepts number as argument, any integer value allowed)
* **stop** - Stops playback of music and resets playback
* **volume** - Sets or gets volume of playback (in %)

### NSFW

These commands are premium only (and aren't in this repository)

* **booru \<booru>** - Random image from specified booru
* **danbooru** - Random image from danbooru
* **gelbooru** - Random image from gelbooru
* **hypnohub** - Random image from hypnohub
* **konachan-lewd** - Highquality wallpapers
* **nekos-lewd** - Not so safe endpoints of nekos.life
* **realbooru** - Realistic version of rule34
* **rule34** - Well you should know what this is
* **xbooru** - The dirty sister of rule34
* **yandere** - Random yandere image

### Special

This category contains owner-only commands

* **addflag** (alias `toggleflag`) - Adds (or removes) flag to user
* **afk** - Toggles bots AFK mode (only changes status)
* **blacklist** - Doesn't yet work
* **guilds** - List guilds
* **reloadservice** - Reloads given service
* **reloadstructures** - Reloads given structure (may cause unexpected results when renaming functions)
* **restart** - Stops the bot (which will get restarted if configured properly)
* **runscripts** - Runs custom bash script
* **settings** - Changes bot settings (name will be changed in future)
* **shorten** - Shortens URL, specific to our server
* **status** - Changes status of bot
* **update** - Runs `update` script

### Util

* **prefix** - Gets or sets bots prefix
* **ping** - Pings the discord API and shows how much time it consumed
* **help** - Shows help about given command

### Commands (builtin by commando)

* **groups** - Lists all command groups
* **enable** - Enables command/group
* **disable** - Disables command/group
* **reload** - Reloads command (Owner only)
* **load** - Loads command (Owner only)
* **unload** - Unloads command (Owner only)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Ficeproductions%2Fdiscord-bot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Ficeproductions%2Fdiscord-bot?ref=badge_large)