exports.run = (arg, by, room) => {
    // Updates bot to the latest version from git. Only dev can use it. Taken from: https://github.com/TheMezStrikes/uopbot/blob/master/commands.js
    let text;
    if (config.git) {
        const child_process = require('child_process');
        try {
            child_process.execSync("git pull " + config.git + " master", { stdio: "inherit" });
            text = "git pull successful.";
        }
        catch (e) {
            this.say(room, e.name + ": " + e.message);
            text = "git pull unsuccessful.";
        }
    }
    else {
        text = "There is no git URL specified for this bot.";
    }
    this.say(room, text);
};

module.exports.config = {
    aliases: []
};