exports.run = (arg, by, room) => {
    let text = "<img src = \"https://i.snipboard.io/a6LIdY.jpg\" width=50 height=50>";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};