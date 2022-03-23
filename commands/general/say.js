exports.run = (arg, by, room) => {
	// Tells the bot something to say, and it says it. Won't say commands.
	this.say(room, stripCommands(arg));
};

module.exports.config = {
	aliases: ["tell"]
};