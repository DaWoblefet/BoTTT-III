"use strict";

/**
 * Developer Commands
 * These commands are useful for bot upkeep, or generally speaking, any arbitrary action.
 * They are very powerful and not intended for the average user.
 */

const { inspect } = require("util");
const axios = require("axios");

exports.commands = {
	// Refreshes the command list and parser. To refresh something else, you must stop the bot completely.
	rl: "reload",
	reload: function(arg, by, room) {
		try {
			this.uncacheTree("./commands.js");
			Commands = require("../commands.js").commands;
			this.uncacheTree("./parser.js");
			Parse = require('../parser.js').parse;
			this.say(room, "Commands reloaded.");
		}
		catch (e) {
			error("Failed to reload: " + inspect(e));
		}
	},
	
	// Tells BoTTT III to say whatever you want, including PS commands. Restricted to room owners. Must be done in PM.
	// To use: .custom [room] thing you want BoTTT III to say/do
	// Example: ".custom [vgc] !dt pikachu" will cause BoTTT III to say !dt pikachu in the VGC room.

	// If you need to display HTML or do some other sequence of commands that is too long for a PM, you can link the bot
	// a pastebin.com/raw/ link and it will read and execute that instead.
	// Example: ".custom [vgc] https://pastebin.com/raw/theRestOfThePastebinURL"
	custom: async function(arg, by, room) {
		let targetRoom;
		if (arg.indexOf("[") === 0 && arg.indexOf("]") > -1) {
			targetRoom = arg.slice(1, arg.indexOf("]"));
			arg = arg.substr(arg.indexOf("]") + 1).trim();
		}

		if (arg.substr(0, 25) === "https://pastebin.com/raw/") {
			const contents = await axios.get(arg);
			arg = contents.data;
		}

		// If no target room is specified, it just sends it back as a PM.
		this.say(targetRoom || room, arg);
	},

	// Executes arbitrary javascript. Only dev can use it.
	js: function(arg, by, room) {
		try {
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		}
		catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},

	// Updates bot to the latest version from git. Only dev can use it. Taken from: https://github.com/TheMezStrikes/uopbot/blob/master/commands.js
	gitpull: function(arg, by, room) {
		let text;
		if (config.git) {
			const child_process = require('child_process');
			try {
				child_process.execSync("git pull " + config.git + " master", {stdio: "inherit"});
				text = "git pull successful.";
			}
			catch (e) {
				this.say(room, e.name + ": " + e.message);
				text = "git pull unsuccessful.";
			} 	
		}
		else {
			text = "There is no git URL specified for this bot.";
		}
		this.say(room, text);
	},

	kill: function(arg, by, room) {
		info(config.nick + " terminated at " + new Date().toLocaleString());
		process.exit(-1);
	},

	testpermissions: function(arg, by, room) {
		// Normal cases in VGC room
		this.say(room, "Normal cases in VGC");
		this.say(room, "Driver");
		this.say(room, this.canUse("joke", "vgc", "%ansena", "")); // 1
		this.say(room, this.canUse("custom", "vgc", "%ansena", "")); // 0
		this.say(room, this.canUse("samples", "vgc", "%ansena", "")); // 1
		this.say(room, this.canUse("tour", "vgc", "%ansena", "")); // 1

		this.say(room, "Voice");
		this.say(room, this.canUse("joke", "vgc", "+ansena", "")); // 0
		this.say(room, this.canUse("custom", "vgc", "+ansena", "")); // 0
		this.say(room, this.canUse("samples", "vgc", "+ansena", "")); // 1
		this.say(room, this.canUse("tour", "vgc", "+ansena", "")); // 1

		this.say(room, "Reg");
		this.say(room, this.canUse("joke", "vgc", " ansena", "")); // 0
		this.say(room, this.canUse("custom", "vgc", " ansena", "")); // 0
		this.say(room, this.canUse("samples", "vgc", " ansena", "")); // 2
		this.say(room, this.canUse("tour", "vgc", " ansena", "")); // 0

		// Normal cases not in VGC room
		this.say(room, "Normal cases not in VGC");
		this.say(room, "Driver");
		this.say(room, this.canUse("joke", "notvgc", "%ansena", "")); // 1
		this.say(room, this.canUse("custom", "notvgc", "%ansena", "")); // 0
		this.say(room, this.canUse("samples", "notvgc", "%ansena", "")); // 1
		this.say(room, this.canUse("tour", "notvgc", "%ansena", "")); // 1

		this.say(room, "Voice");
		this.say(room, this.canUse("joke", "notvgc", "+ansena", "")); // 0
		this.say(room, this.canUse("custom", "notvgc", "+ansena", "")); // 0
		this.say(room, this.canUse("samples", "notvgc", "+ansena", "")); // 1
		this.say(room, this.canUse("tour", "notvgc", "+ansena", "")); // 0

		this.say(room, "Reg");
		this.say(room, this.canUse("joke", "notvgc", " ansena", "")); // 0
		this.say(room, this.canUse("custom", "notvgc", " ansena", "")); // 0
		this.say(room, this.canUse("samples", "notvgc", " ansena", "")); // 2
		this.say(room, this.canUse("tour", "notvgc", " ansena", "")); // 0

		// Special case tests
		this.say(room, "Special cases");
		this.say(room, this.canUse("blog", "notvgc", "%ansena", "")); // 0
		this.say(room, this.canUse("blog", "vgc", "%ansena", "")); // 1
		this.say(room, this.canUse("blog", "vgc", "%mish", "")); // 0
		this.say(room, this.canUse("blog", "notvgc", "%mish", "")); // 0
		this.say(room, this.canUse("tour", "vgc", " legavgc", "vgc13")); // 1
		this.say(room, this.canUse("custom", ",notvgc", "+blarajan", "[vgc] hello")); // 1
	}
};
