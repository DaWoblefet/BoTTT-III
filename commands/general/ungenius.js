exports.run = async (arg, by, room) => {
    let text = "<img src = \"https://cdn.discordapp.com/emojis/418886687180062720.png\" width=50 height=50>";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};