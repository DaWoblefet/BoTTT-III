exports.run = (arg, by, room) => {
    let text = "<img src = \"https://cdn.discordapp.com/emojis/483997875181715456.png\" width=32 height=32 style='border: 1px solid black;'>";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};