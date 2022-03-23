exports.run = (arg, by, room) => {
    let text =
        '<div style = "width: 485px; margin: auto; margin-bottom: 5px;"> \
    		<a href = "https://www.youtube.com/watch?v=buc64u6Q_oA" style = "text-align: center; font-size: 200%; display: block; color: black;border: 3px solid black; margin: auto; border-radius: 10px; background-color: #a4d1e8; padding: 5px 0;"> \
				<psicon pokemon="wooper"> \
				<strong>Acquire the Sire</strong> \
				<psicon pokemon="wooper"> \
    		</a> \
		</div> \
		<div style = "width: 485px; margin: auto;"> \
    		<div style = "display: inline-block; vertical-align: 50%; padding-right: 10px;"> \
        		<img src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="transform: scaleX(-1); display: block; padding-bottom: 20px;"> \
        		<img src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="transform: scaleX(-1); display: block;"> \
    		</div> \
			<div style = "display: inline-block;"> \
				<a href = "https://www.youtube.com/watch?v=buc64u6Q_oA"><img src = "https://cdn.discordapp.com/attachments/656292565242347520/749657145305202748/acquirethesire.gif" width="360" height="202"></a> \
			</div> \
			<div style = "display: inline-block; vertical-align: 50%; padding-left: 10px;"> \
				<img src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="display: block; padding-bottom: 20px;"> \
				<img class = "fa fa-spin" src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="display: block;"> \
			</div> \
		</div>';
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: ["sire"]
};