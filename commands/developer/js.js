exports.run = (arg, by, room) => {
    // Executes arbitrary javascript. Only dev can use it.
    try {
        let result = eval(arg.trim());
        this.say(room, JSON.stringify(result));
    }
    catch (e) {
        this.say(room, e.name + ": " + e.message);
    }
};

module.exports.config = {
    aliases: []
};