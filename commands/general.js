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
		const defaultTour = "regg";
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

		if (['double', 'doubleelim', 'doubleelimination'].includes(arglist[1])) {
			isDoubleElimination = true;
		}

		if (['ots', 'openteamsheet'].includes(arglist[1])) {
			isForceOpenTeamSheet = true;
		}
		
		if (['bo3', 'bestofthree'].includes(arglist[1])) {
			isBestOfThree = true;
			isForceOpenTeamSheet = true;
		}

		if (tourObject) {
			tourformat = tourObject.tourformat;
			tourname = tourObject.tourname;
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

	// Displays recent VGC usage stats. Also works in PM.
	usgae: "usage",
	usage: async function(arg, by, room) {
		this.say(room, 'This command is currently under maintenance. Sorry :(');
		return;
		let text = "";
		let JSONresponse;
		let wasSuccessful = true;
		let lastMonthRank;
		let month = 12;
		let year = 2022;
		const defaultFormat = "gen9vgc2023series1";
		const defaultRank = "1760";
		const pikalytics = "https://pikalytics.com";
		const psUsage = "https://www.smogon.com/stats/" + year + "-" + (month < 10 ? "0" + month : month) + "/" + defaultFormat + "-1760.txt";
		const psDetailedUsage = "https://www.smogon.com/stats/" + year + "-" + (month < 10 ? "0" + month : month) + "/moveset/" + defaultFormat + "-1760.txt";

		// Usage stats API: https://www.smogon.com/forums/threads/usage-stats-api.3661849
		const getData = async url => {
			try {
				const response = await axios.get(url);
				JSONresponse = response.data;
				lastMonthRank = JSONresponse.rank;
			}
			catch (error) {
				wasSuccessful = false;
				if (error.response.status = "404") {
					if (error.response.statusText === "Service Unavailable") {
						text = "Unable to communicate with the usage stats API. Tell fingerprint it's not working: https://www.smogon.com/forums/members/fingerprint.510904/";
					}
					else {
						text = "No usage data found for " + arg + ".";
					}
				}
				else {
					error(new Date().toLocaleString() + error);
				}
			}
		};

		if (arg) { // Pokemon is specified
			const arglist = arg.split(',');
			if (this.isPM(room)) {
				const mon = toID(arglist[0]);
				const format = arglist[1] ? toID(arglist[1]) : defaultFormat;
				// OU and DOU are higher traffic, so they get a special ELO to search against 
				const rank = (format === "gen8ou" || format === "gen8doublesou") ? "1825" : defaultRank;
				await getData("https://smogon-usage-stats.herokuapp.com/" + year + "/" + month + "/" + format + "/" + rank + "/" + mon);
				if (wasSuccessful) {
					await getData("https://smogon-usage-stats.herokuapp.com/" + year + "/" + month + "/" + format + "/" + rank + "/" + mon);
					if (wasSuccessful) {
						room = toID(config.rooms[0]);

						// Get last month's ranking, but don't override with old usage stats
						let temp = JSONresponse;
						await getData("https://smogon-usage-stats.herokuapp.com/" + (month === 1 ? year - 1 : year) + "/" + (month === 1 ? 12 : month - 1) + "/" + format + "/" + rank + "/" + mon);
						JSONresponse = temp;
						this.mostRecentUserPM = toID(by);
						text = "/pminfobox " + this.mostRecentUserPM + ", " + await this.generateHTMLUsagePM(JSONresponse, month, lastMonthRank);
					}
				}
			}
			else { // has permissions for htmlbox
				const mon = toID(arglist[0]);
				const format = arglist[1] ? toID(arglist[1]) : defaultFormat;
				// OU and DOU are higher traffic, so they get a special ELO to search against 
				const rank = (format === "gen8ou" || format === "gen8doublesou") ? "1825" : defaultRank;
				this.say(room, "/adduhtml " + mon + ", Loading usage stats data for " + arg + "...");
				await getData("https://smogon-usage-stats.herokuapp.com/" + year + "/" + month + "/" + format + "/" + rank + "/" + mon);
				if (wasSuccessful) {
					// Get last month's ranking, but don't override with old usage stats
					let temp = JSONresponse;
					await getData("https://smogon-usage-stats.herokuapp.com/" + (month === 1 ? year - 1 : year) + "/" + (month === 1 ? 12 : month - 1) + "/" + format + "/" + rank + "/" + mon);
					JSONresponse = temp;
					text = "/changeuhtml " + mon + ", " + await this.generateHTMLUsage(JSONresponse, month, lastMonthRank);
				}
			}
		}
		else { // Generic links to usage stats
			// HTML for generic usage
			text += 
			'<strong>VGC Usage Stats!</strong> \
			<ul style = "margin: 0 0 0 -20px"> \
				<li><a href = "' + pikalytics + '">Pikalytics - Battle Spot and Showdown usage</a></li> \
				<li><a href = "' + psUsage + '">Raw Showdown Usage</a></li> \
				<li><a href = "' + psDetailedUsage + '">Raw Showdown Detailed Usage</a></li> \
			</ul>';

			if (this.isPM(room)) {
				room = toID(config.rooms[0]);
				this.mostRecentUserPM = toID(by);
				text = "/pminfobox " + this.mostRecentUserPM + ", " + text; 
			}
			else {
				text = "/addhtmlbox " + text; 
			}
		}
		this.say(room, text);
	},

	uno: function(arg, by, room) {
		this.say(room, "/uno create 10");
		this.say(room, "/uno autostart 30");
		let timer = toID(by) === "dingram" ? 5 : 10;
		this.say(room, "/uno timer " + timer);
	},

	sample: "samples",
	samples: function(arg, by, room) {
		let defaultFormat = "gen9vgc2025regulationg";
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

	cc: "contentcreators",
	creators: "contentcreators",
	contentcreators: function(arg, by, room) {
		let text;
		let creatorData = [
			["exeggutor-alola", "Wolfe Glick", "https://www.twitch.tv/wolfeyvgc", "WolfeyVGC", "https://www.youtube.com/wolfeyvgc", "WolfeyVGC", "https://twitter.com/WolfeyGlick", "@WolfeyGlick"],
			["rotom-wash", "Aaron Zheng", "https://www.twitch.tv/cybertronvgc", "CybertronVGC", "https://www.youtube.com/CybertronProductions", "CybertronProductions", "https://twitter.com/CybertronVGC", "@CybertronVGC"],
			["mudsdale", "Eduardo Cunha", "https://www.twitch.tv/EmbCPT", "EmbCPT", "https://www.youtube.com/channel/UCla-h0hvByq_LSzBMqRr4eA", "EmbC", "https://twitter.com/MeninoJardim", "@MeninoJardim"],
			["piplup", "James Baek", "https://www.twitch.tv/jameswbaek", "JamesWBaek", "https://youtube.com/jameswbaek", "James Baek", "https://twitter.com/JamesWBaek", "@JamesWBaek"],
			["salazzle", "Jamie Boyt", "https://www.twitch.tv/jamieboyt", "JamieBoyt", "https://www.youtube.com/c/JamieBoytVGC", "JamieBoytVGC", false, false],
			["hariyama", "Alex Gomez", "https://www.twitch.tv/pokealexvgc", "PokeAlexVGC", "https://www.youtube.com/user/Pokealexproductions", "PokeAlex Productions", "https://twitter.com/PokeAlex_", "@PokeAlex_"],
			["buzzwole", "Graham Amedee", false, false, "https://www.youtube.com/channel/UCBvb1EZjYRLuTot13DCIDXA", "Graham Ammodee", "https://twitter.com/amedeegraham", "@AmedeeGraham"],
			["pachirisu", "Sejun Park", "https://www.twitch.tv/Sejun_Park", "Sejun_Park", false, false, "https://twitter.com/pokemon_tcg", "@pokemon_tcg"],
			["cresselia", "Collin Heier", "https://www.twitch.tv/TheBattleRoom", "TheBattleRoom", "https://www.youtube.com/channel/UCoum47pkrc2jtZ0uTcm5R-A", "BattleRoomVGC", "https://twitter.com/BattleRoom", "@BattleRoom"],
			["lugia", "Fiona Szymkiewicz", "https://www.twitch.tv/yoshi_and_lugia", "yoshi_and_lugia", "https://www.youtube.com/user/Yoshiandlugia", "Yoshiandlugia", "https://twitter.com/Yoshiandlugia", "@Yoshiandlugia"],
			["stonjourner", "Barry Anderson", "https://www.twitch.tv/bazanderson", "BazAnderson", "https://www.youtube.com/user/bazandersonvgc", "Baz Anderson", "https://twitter.com/bazandersonvgc", "@bazandersonvgc"],
			["salamence-mega", "Paul Ruiz", "https://www.twitch.tv/ralfdude90", "ralfdude90", "https://www.youtube.com/channel/UC7GjRTGrjXJ9lMWhkFCstxw", "ralfdude90", "https://twitter.com/ralfdude90", "@ralfdude90"],
			["mew", "Sierra Dawn", "https://www.twitch.tv/sierradawn", "SierraDawn", "https://www.youtube.com/sierradawn", "Sierra Dawn", "https://twitter.com/Sierradawnx3", "@Sierradawnx3"],
			["conkeldurr", "Lee Provost", "https://www.twitch.tv/osirusstudios", "OsirusStudios", "https://www.youtube.com/channel/UCi3LrHS-zJDTEO1Acml0Hxg", "Osirus Studios", "https://twitter.com/osirusvgc", "@osirusvgc"],
			["maractus", "James Eakes", "https://www.twitch.tv/eakestv", "EakesTV", "https://www.youtube.com/eakespokemon", "EakesTV", "https://twitter.com/eakestv", "@EakesTV"],
			["bidoof", "Gabby Snyder", "https://www.twitch.tv/simplyGabby", "simplyGabby", "https://www.youtube.com/GabbySnyder", "Gabby Snyder", "https://twitter.com/GabbySnyder", "@GabbySnyder"],
			["togepi", "Ashton Cox", "https://www.twitch.tv/ashtoncoxgaz", "AshtonCoxGAZ", "https://www.youtube.com/channel/UCy5DFEpL1St735uHmMXz1xg", "AshtonCoxGAZ", "https://twitter.com/ashtoncoxgaz", "@AshtonCoxGAZ"],
			["yveltal", "Joe Ugarte", "https://twitch.tv/joeux9", "JoeUX9", "https://youtube.com/joeux9", "JoeUX9", "https://twitter.com/joeux9", "@JoeUX9"],
			["articuno", "Aldrich Yan Sutandra", "https://www.twitch.tv/aldrichyan", "aldrichyan", "https://www.youtube.com/channel/UCTN3uwcBhyid2iEOCD68cqg", "Aldrich Yan Sutandra", "https://twitter.com/AldrichYan", "@AldrichYan"],
			["mandibuzz", "Bryce Young", false, false, "https://www.youtube.com/MandDGNXPokemon/", "Mandby", "https://twitter.com/Bryce_Mandby", "@Bryce_Mandby"],
			["sylveon", "Rosemary Kelley", "https://www.twitch.tv/nekkragaming", "NekkraGaming", "https://www.youtube.com/channel/UCIlFSUs8MzCuYosEMq0WFeg", "Nekkra", "https://twitter.com/NekkraGaming", "@NekkraGaming"],
			["wobbuffet", "Leonard Craft III", false, false, "https://www.youtube.com/dawoblefet", "DaWoblefet", "https://twitter.com/DaWoblefet", "@DaWoblefet"],
			["honchkrow", "Marcos Perez", "https://www.twitch.tv/moxieboosted", "MoxieBoosted", "https://www.youtube.com/moxieboosted", "MoxieBoosted", "https://twitter.com/MoxieBoosted", "@MoxieBoosted"],
			["metagross", "Adi Subramanian", false, false, "https://www.youtube.com/channel/UCXGqNEvshgc-85K_1go2ETw", "ck49", "https://twitter.com/adisubra", "@adisubra"],
		];
		if (this.isPM(room)) {
			text = this.generateHTMLContentCreators(creatorData, true);
			room = toID(config.rooms[0]);
			this.mostRecentUserPM = toID(by);
			text = "/pminfobox " + this.mostRecentUserPM + ", " + text;
		}
		else {
			text = this.generateHTMLContentCreators(creatorData, false);
			text = "/addhtmlbox " + text;	
		}
		this.say(room, text);
	},
};
