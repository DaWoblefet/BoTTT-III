exports.run = (arg, by, room) => {
    let text = '/addhtmlbox <img src = "https://play.pokemonshowdown.com/sprites/ani-shiny/yveltal.gif" width = 201 height = 188>';
    this.say(room, text);
};

module.exports.config = {
    aliases: []
};