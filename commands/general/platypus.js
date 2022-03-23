exports.run = (arg, by, room) => {
    const text =
        '<center> \
			<img src = "https://i.ibb.co/ws6dDYg/rsz-platypus-png.png" class = "fa fa-spin" width = "100" height = "100"> \
			<a href = "https://youtu.be/VaNbDYGmGwc" style = "font-size: 20px;">Platypus on the Prowl</a> \
			<img src = "https://i.ibb.co/ws6dDYg/rsz-platypus-png.png" class = "fa fa-spin" width = "100" height = "100"> \
			<br> \
			<br> \
			<img src = "https://cdn.discordapp.com/attachments/394481120806305794/506966120482209792/platyprowl.gif" height = "175" width = "170"> \
		</center>';
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: []
};