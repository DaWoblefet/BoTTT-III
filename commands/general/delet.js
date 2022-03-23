exports.run = (arg, by, room) => {
    this.say(room, arg + " **deleted**.");
};

module.exports.config = {
    aliases: []
};