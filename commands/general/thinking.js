exports.run = async (arg, by, room) => {
    let text = "<img src = \"https://i.imgur.com/vXbla1s.png\" width=24 height=27>";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};