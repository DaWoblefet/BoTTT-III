exports.run = (arg, by, room) => {
    // Displays a notice in case I need to tweak the bot.
    let text = "/wall Please note that " + config.nick + " may be tweaked periodically. Please be patient if a tour is canceled; it's probably just to test something.";
    this.say(room, text);
};

module.exports.config = {
    aliases: []
};