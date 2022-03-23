exports.run = (arg, by, room) => {
    /* Tells BoTTT III to say whatever you want, including PS commands. Restricted to room owners. Must be done in PM.
         * To use: .custom [room] thing you want BoTTT III to say/do
         * Example: ".custom [vgc] !dt pikachu" will cause BoTTT III to say !dt pikachu in the VGC room.
    
         * If you need to display HTML or do some other sequence of commands that is too long for a PM, you can link the bot
         * a pastebin.com/raw/ link and it will read and execute that instead.
         * Example: ".custom [vgc] https://pastebin.com/raw/theRestOfThePastebinURL"
         */

    let targetRoom;
    if (arg.indexOf("[") === 0 && arg.indexOf("]") > -1) {
        targetRoom = arg.slice(1, arg.indexOf("]"));
        arg = arg.substr(arg.indexOf("]") + 1).trim();
    }

    if (arg.substr(0, 25) === "https://pastebin.com/raw/") {
        const contents = await axios.get(arg);
        arg = contents.data;
    }

    // If no target room is specified, it just sends it back as a PM.
    this.say(targetRoom || room, arg);
};

module.exports.config = {
    aliases: []
};