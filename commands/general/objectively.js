
exports.run = (arg, by, room) => {
    let text =
        "Something is \"objective\" when it is true independently of personal feelings or opinions, instead based on hard facts. For example, Flamethrower objectively has higher accuracy than Fire Blast, and Fire Blast objectively has a higher Base Power than Flamethrower. \
		<br><br> \
		Subjective refers to personal preferences, opinions, or feelings. Anything subjective is subject to interpretation. For example, you might think Flamethrower is better than Fire Blast, but another player might think Fire Blast is better; the opinion is subjective. \
		<br><br> \
		That's not to say opinions are bad! It's also ok to put forth reasoning into your opinions and defend them. It's not correct, however, to say some opinion you have is objectively true. \
		";
    this.say(room, "/addhtmlbox " + text);
};

module.exports.config = {
    aliases: ["objective"]
};