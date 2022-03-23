exports.run = (arg, by, room) => {
    // Information/Help Commands
    // Links to a more detailed pastebin for the user to read about the bot's commands.
    let text;
    if (config.botguide) {
        text = "A guide on how to use " + config.nick + " can be found here: " + config.botguide;
    }
    else {
        text = "There is no guide for this bot. PM the owner, " + config.owners[0] + " , with any questions.";
    }
    this.say(room, text);
};

module.exports.config = {
    aliases: ["about", "guide", "help"]
};