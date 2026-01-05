"use strict";

const axios = require("axios");
const tourJSON = require("../tourformats.json");
const STRIP_COMMANDS = true;

exports.commands = {
	// Links to a more detailed pastebin for the user to read about the bot's commands.
	about: "commands",
	guide: "commands",
	help: "commands",
	commands: function(arg, by, room) {
		let text;
		if (config.botguide) {
			text = "A guide on how to use " + config.nick + " can be found here: " + config.botguide;
		}
		else {
			text = "There is no guide for this bot. PM the owner, " + config.owners[0] + " , with any questions.";
		}
		this.say(room, text);
	},

	git: function(arg, by, room) {
		let text;
		if (config.git) {
			text = "Source code for " + config.nick + ": " + config.git;
		}
		else {
			text = "There is no public source code for " + config.nick + ". However, the repository for the bot it is based on, BoTTT III, can be found here: https://github.com/DaWoblefet/BoTTT-III.";
		}
		this.say(room, text);
	},

	// Tells the bot something to say, and it says it. Won't say commands.
	tell: "say",
	say: function(arg, by, room) {
		this.say(room, arg, STRIP_COMMANDS);
	},

	// Creates a tournament with custom options. Sample teams are provided for each format when applicable.
	tour: function(arg, by, room) {
		if (this.tours[room]) {
			this.say(room, "A tournament has already been started.");
			return;
		}

        let arglist = arg.split(', ');
		if (arglist.length > 2) {
			this.say(room, "Too many arguments specified.");
			return;
		}
		let tourformat;
		let tourname;
		let tourObject;
		let isOfficial = false;
		const defaultTour = "regf";
		const defaultTourType = 'elimination';
		const defaultTourPlayerCap = 128;
		let isDoubleElimination = false;
		let isForceOpenTeamSheet = false;
		let isBestOfThree = false;
		
		// Handle default case, double elim, and random format options.
		let formatArg = toID(arglist[0]);
		switch (formatArg) {
			case "": // No argument specified, use default tour.
                formatArg = defaultTour;
				break;
			case "double":
			case "doubleelim":
			case "doubleelimination":
				formatArg = defaultTour;
				isDoubleElimination = true;
				break;
			case "ots":
			case "openteamsheet":
				formatArg = defaultTour;
				isForceOpenTeamSheet = true;
				break;
			case "bo3":
			case "bestofthree":
				formatArg = defaultTour;
				isForceOpenTeamSheet = true;
				isBestOfThree = true;
				break;
			case "official":
				if (!this.hasRank(by, "%@*~#")) {
					this.say(room, "/pm " + by + ", You do not have permission to start official tours.");
					return;
				}
				formatArg = defaultTour;
				isOfficial = true;
				break;
			case "random":
			case "randomvgc":
				let vgcFormats = ["vgc09", "vgc10", "vgc11", "vgc12", "vgc13", "vgc14", "vgc15", "vgc16", "vgc17", "vgc18", "sun", "moon", "ultra", "vgc20", "vgc21", "vgc22", "regc", "regd", "regf", "regg", "regh"];
				formatArg = vgcFormats[Math.floor(Math.random() * vgcFormats.length)];
				break;
			default:
				break;
		}

		// Prepare tournament format.
		// TODO fix if the format is not an alias
        if (Aliases.hasOwnProperty(formatArg)) {
            tourObject = tourJSON[Aliases[formatArg]];
        } else if (formatArg.includes('random') || formatArg.includes('randbat')) {
            this.say(room, "Cannot start Random Battle tournaments.");
			return;
        } else if (formatArg.includes('cap')) {
            this.say(room, "Cannot start CAP tournaments.");
            return;
        } else { // hopefully it's valid
            tourformat = formatArg;
			tourname = "";
        }

		if (tourObject) {
			tourformat = tourObject.tourformat;
			tourname = tourObject.tourname;
		}

		if (['double', 'doubleelim', 'doubleelimination'].includes(arglist[1])) {
			isDoubleElimination = true;
		}

		if (['ots', 'openteamsheet'].includes(arglist[1])) {
			isForceOpenTeamSheet = true;
		}
		
		if (['bo3', 'bestofthree'].includes(arglist[1])) {
			isBestOfThree = true;

			if (tourformat.startsWith("gen9vgc202")) {
				isForceOpenTeamSheet = true;
			}
		}
		
		let tourCommand = "/tour create " + tourformat + ", " + defaultTourType + ", " + defaultTourPlayerCap + ", " + (isDoubleElimination ? 2 : 1);
		if (tourname) tourCommand += ", " + tourname;
		if (tourname && isForceOpenTeamSheet) {
			tourCommand += isBestOfThree ? " (Bo3 OTS)" : " (Forced OTS)";
		}
		this.say(room, tourCommand);

		let tourRules = '';
		if (tourObject && tourObject.tourrules) {
			tourRules = tourObject.tourrules;
		}
		if (isForceOpenTeamSheet) {
			if (tourRules) tourRules += ", ";
			if (tourformat.startsWith("gen9vgc202")) {
				tourRules += "Force Open Team Sheets, !Open Team Sheets";
			} else {
				tourRules += "Force Open Team Sheets";
			}
		}
		if (isBestOfThree) {
			if (tourRules) tourRules += ", ";
			tourRules += "Best of = 3";
		}
		if (tourRules) {
			this.say(room, "/tour rules " + tourRules);
		}
		
		if (tourObject) {
			// Note: this will always display tournote, even if the tour wasn't started.
			if (tourObject.tournote) {
				this.say(room, "/wall " + tourObject.tournote);
			}

			if (tourObject.formatDescription && tourObject.sampleTeams) {
				let htmlText = this.generateHTMLSample(tourObject.formatname, tourObject.formatDescription, tourObject.sampleTeams, true);
				this.say(room, "/addhtmlbox " + htmlText);
			}

			if (isOfficial) {
				this.say(room,'/addhtmlbox <div style="text-align: center"> <img src="https://www.smogon.com/media/zracknel-beta.svg.m.1" width="50" height="50"> <h3 style="display: inline">Official Smogon VGC Room Tournament</h3> <img src="https://www.smogon.com/media/zracknel-beta.svg.m.1" width="50" height="50"> <br> <p>See this <a href="https://www.smogon.com/forums/threads/official-room-tournaments-on-pokemon-showdown.3683264/#post-8837920" target="_blank" rel="noopener">Smogon VGC thread</a> for more details.</p> </div>')
			}
		}	
	},

	// Displays a notice in case I need to tweak the bot.
	notice: function(arg, by, room) {
		let text = "/wall Please note that " + config.nick + " may be tweaked periodically. Please be patient if a tour is canceled; it's probably just to test something.";
		this.say(room, text);
	},

	uno: function(arg, by, room) {
		this.say(room, "/uno create");
		this.say(room, "/uno autostart 30");
		let timer = toID(by) === "dingram" ? 5 : 10;
		this.say(room, "/uno timer " + timer);
	},

	sample: "samples",
	samples: function(arg, by, room) {
		let defaultFormat = "gen9vgc2026regulationf";
		let text = "";
        let formatArg = arg ? arg : defaultFormat;
        if (Aliases.hasOwnProperty(formatArg)) {
            formatArg = Aliases[formatArg];
        }
        
		if (this.isPM(room)) {
			room = toID(config.rooms[0]);
            this.mostRecentUserPM = toID(by);

			if (tourJSON.hasOwnProperty(formatArg) && tourJSON[formatArg].sampleTeams.length) {
				text = "/pminfobox " + this.mostRecentUserPM + ", " + this.generateHTMLSample(tourJSON[formatArg].formatname, tourJSON[formatArg].formatDescription, tourJSON[formatArg].sampleTeams, true, true);
			} else {
				text = "/pminfobox " + this.mostRecentUserPM + ", " + "Invalid format specified. Valid formats are: ";
				let validFormats = [];
				let keys = Object.keys(tourJSON);
				for (const key in keys) {
					if (tourJSON[keys[key]].sampleTeams.length) {
						validFormats.push(keys[key]);
					}
				}
				text += "all, " + validFormats.join(", ");
			}
		} else if (tourJSON.hasOwnProperty(formatArg) && tourJSON[formatArg].sampleTeams.length) {
			text = "/addhtmlbox " + this.generateHTMLSample(tourJSON[formatArg].formatname, tourJSON[formatArg].formatDescription, tourJSON[formatArg].sampleTeams, true, false);
		} else if (arg === "all") {
			text = "/addhtmlbox ";
			let keys = Object.keys(tourJSON);
			
			for (const key in keys) {
				if (tourJSON[keys[key]].sampleTeams.length) {
					text += this.generateHTMLSample(tourJSON[keys[key]].formatname, tourJSON[keys[key]].formatDescription, tourJSON[keys[key]].sampleTeams, false, false);
				}
			}
		} else {
			text = "/addhtmlbox Invalid format specified. Valid formats are: ";
			let validFormats = [];
			let keys = Object.keys(tourJSON);
			for (const key in keys) {
				if (tourJSON[keys[key]].sampleTeams.length) {
					validFormats.push(keys[key]);
				}
			}
			text += "all, " + validFormats.join(", ");
		}
		this.say(room, text);
	},
};
