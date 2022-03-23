exports.run = (arg, by, room) => {
    let text = "<img src = \"https://cdn.discordapp.com/emojis/403682643012616202.png\" width=50 height=50>";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};