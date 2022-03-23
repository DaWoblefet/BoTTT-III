exports.run = (arg, by, room) => {
    let text;

    if (config.git) {
        text = "Source code for " + config.nick + ": " + config.git;
    }
    else {
        text = "There is no public source code for " + config.nick + ". However, the repository for the bot it is based on, BoTTT III, can be found here: https://github.com/DaWoblefet/BoTTT-III.";
    }
    this.say(room, text);
};

module.exports.config = {
    aliases: []
};