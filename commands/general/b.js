exports.run = (arg, by, room) => {
    let text;
    const bEmoji = "\ud83c\udd71\ufe0f";
    if (arg.match(/(b|B)/gm)) {
        text = arg.replace(/(b|B)/g, bEmoji);
    }
    else {
        text = bEmoji;
    }
    if (room.charAt(0) != ",") {
        text = "/addhtmlbox " + text;
    }
    this.say(room, text);
};

module.exports.config = {
    aliases: []
};