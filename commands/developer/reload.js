exports.run = (arg, by, room) => {
    /* Developer Commands
         * These commands are useful for bot upkeep, or generally speaking, any arbitrary action.
         * They are very powerful and not intended for the average user.
         */

    // Refreshes the command list and parser. To refresh something else, you must stop the bot completely. Only dev has access.

    const { inspect } = require("util");

    try {
        this.uncacheTree("./commands.js");
        Commands = require("./commands.js").commands;
        this.uncacheTree("./parser.js");
        Parse = require('./parser.js').parse;
        this.say(room, "Commands reloaded.");
    }
    catch (e) {
        error("Failed to reload: " + inspect(e));
    }
};


module.exports.config = {
    aliases: ["rl"]
};

