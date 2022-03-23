exports.run = (arg, by, room) => {
    arg = arg.toLowerCase().replace("'", "");
    let pokemonSprite = "https://play.pokemonshowdown.com/sprites/ani/" + arg + ".gif";

    let probe = require('probe-image-size');
    let height;
    let width;
    try {
        await probe(pokemonSprite).then(result => {
            height = result.height;
            width = result.width;
        });
    }
    catch (err) {
        pokemonSprite = "https://play.pokemonshowdown.com/sprites/rby/missingno.png";
        height = 96;
        width = 96;
    }

    let text =
        '<div style = "position: relative"> \
    <img src = "https://steamuserimages-a.akamaihd.net/ugc/933813375174289297/19F16DBEDED8FF15F8D969EE714BD1319149EB9D/" height = "'+ (height * 5) + '" width = "' + (width * 5) + '"> \
    <img src = "' + pokemonSprite + '" height = "' + (height * 5) + '" width = "' + (width * 5) + '" style = "position: absolute; top: 0%; left: 0%"> \
</div>';

    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};

