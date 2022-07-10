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
		let tourformat;
		let tourname;
		let tourObject;
		let isOfficial = false;
		const defaultTour = "vgc2022";
		
		// Handle default case, double elim, and random format options.
		arglist[0] = toID(arglist[0]);
		switch (arglist[0]) {
			case "": // No argument specified, use default tour.
				arglist[0] = defaultTour;
				break;
			case "double":
			case "doubleelim":
			case "doubleelimination":
				arglist[0] = defaultTour;
				arglist[1] = "elimination";
				arglist[2] = "128";
				arglist[3] = "2";
				break;
			case "official":
				if (!this.hasRank(by, "%@*&#")) {
					this.say(room, "/pm " + by + ", You do not have permission to start official tours.");
					return;
				}
				arglist[0] = defaultTour;
				isOfficial = true;
				break;
			case "random":
			case "randomvgc":
				let vgcFormats = ["vgc09", "vgc10", "vgc11", "vgc12", "vgc13", "vgc14", "vgc15", "vgc16", "vgc17", "vgc18", "sun", "moon", "ultra", "vgc20", "vgc21"];
				arglist[0] = vgcFormats[Math.floor(Math.random() * vgcFormats.length)];
				break;
			default:
				break;
		}

		// Prepare tournament format.
		switch (arglist[0]) {
			case "gscup":
			case "vgc22":
			case "vgc2022":
			case "22":
			case "2022":
			case "s12":
			case "series12":
				tourObject = tourJSON["gen8vgc2022"];
				break;
			case "s11":
			case "series11":
			case "8":
			case "s8":
			case "series8":
				tourObject = tourJSON["gen8vgc2021series11"];
				break;
			case "s10":
			case "series10":
				tourObject = tourJSON["gen8vgc2021series10"];
				break;
			case "vgc21":
			case "vgc2021":
			case "21":
			case "7":
			case "s7":
			case "series7":
			case "9":
			case "s9":
			case "series9":
				tourObject = tourJSON["gen8vgc2021series9"];
				break;
			case "vgc20":
			case "vgc2020":
			case "20":
			case "5":
			case "s5":
			case "series5":
				tourObject = tourJSON["gen8vgc2020"];
				break;
			case "nodynamax":
			case "nomax":
				tourObject = tourJSON["gen8vgc2022nodynamax"];
				break;
			case "ultra":
			case "ultraseries":
			case "vgc19":
			case "vgc2019":
			case "19":
				tourObject = tourJSON["gen7vgc2019ultraseries"];
				break;
			case "moon":
			case "moonseries":
				tourObject = tourJSON["gen7vgc2019moonseries"];
				break;
			case "sun":
			case "sunseries":
				tourObject = tourJSON["gen7vgc2019sunseries"];
				break;
			case "vgc18":
			case "vgc2018":
			case "18":
				tourObject = tourJSON["gen7vgc2018"];
				break;
			case "vgc17":
			case "vgc2017":
			case "17":
				tourObject = tourJSON["gen7vgc2017"];
				break;
			case "vgc16":
			case "vgc2016":
			case "16":
				tourObject = tourJSON["gen6vgc2016"];
				break;
			case "vgc15":
			case "vgc2015":
			case "15":
				tourObject = tourJSON["gen6vgc2015"];
				break;
			case "vgc145":
			case "vgc20145":
			case "145":
				tourObject = tourJSON["gen6vgc2014.5"];
				break;
			case "vgc14":
			case "vgc2014":
			case "14":
				tourObject = tourJSON["gen6vgc2014"];
				break;
			case "vgc13":
			case "vgc2013":
			case "13":
				tourObject = tourJSON["gen5vgc2013"];
				break;
			case "vgc12":
			case "vgc2012":
			case "12":
				tourObject = tourJSON["gen5vgc2012"];
				break;
			case "vgc11":
			case "vgc2011":
			case "11":
				tourObject = tourJSON["gen5vgc2011"];
				break;
			case "vgc10":
			case "vgc2010":
			case "10":
				tourObject = tourJSON["gen4vgc2010"];
				break;
			case "vgc09":
			case "vgc2009":
			case "09":
				tourObject = tourJSON["gen4vgc2009"];
				break;
			case "corsola":
			case "corsolacup":
				tourObject = tourJSON["gen8corsolacup"];
				break;
			case "bulu":
			case "tapubulu":
			case "tapubulucup":
			case "bulucup":
			case "bulubash":
				tourObject = tourJSON["gen8bulubash"];
				break;
			case "crab":
			case "craboff":
				tourObject = tourJSON["gen8craboff"];
				break;
			case "chansey":
			case "chanseycup":
			case "chanseyclash":
				tourObject = tourJSON["gen8chanseyclash"];
				break;
			case "pikachu":
			case "pikachucup":
			case "pikachuparty":
				tourObject = tourJSON["gen8pikachuparty"];
				break;
			case "shuckle":
			case "shucklecup":
			case "shuckleshimmy":
				tourObject = tourJSON["gen8shuckleshimmy"];
				break;
			case "dog":
			case "doggy":
			case "doggyduel":
				tourObject = tourJSON["gen8doggyduel"];
				break;
			case "bdsp":
				tourObject = tourJSON["gen8bdspvgc"];
				break;
			case "inverse":
			case "inversevgc":
			case "vgc inverse":
				tourObject = tourJSON["gen8inversevgc"];
				break;
			case "eternamax":
				tourObject = tourJSON["gen8vgc2022eternamax"];
				break;
			case "99":
			case "vgc99":
			case "series99":
				tourObject = tourJSON["gen8series99"];
				break;
			case "hackmons":
			case "vgchackmons":
			case "hackmonsvgc":
				tourObject = tourJSON["gen8vgchackmons"];
				break;
			default:
				if (arglist[0].includes('random') || arglist[0].includes('randbat')) {
					this.say(room, "Cannot start Random Battle tournaments.");
					return;
				} else if (arglist[0].includes('cap')) {
					this.say(room, "Cannot start CAP tournaments.");
					return;
				} else {
					tourformat = arglist[0];
					tourname = "";
				}
				break;
		}

		// If no extra settings are specified, make the tour single elim with 128 player cap.
		if (arglist[1] === undefined) {
			arglist[1] = "elimination";
		}

		if (arglist[1] === "double") {
			arglist[1] = "elimination";
			arglist[2] = "128";
			arglist[3] = "2";
		}

		if (arglist[2] === undefined || isNaN(arglist[2])) {
			arglist[2] = "128";
		}

		if (arglist[3] === undefined|| isNaN(arglist[3])) {
			arglist[3] = "1";
		}

		if (tourObject) {
			tourformat = tourObject.tourformat;
			tourname = tourObject.tourname;
		}
		
		let tourCommand = "/tour create " + tourformat + ", " + arglist[1] + ", " + arglist[2] + ", " + arglist[3];
		if (tourname) tourCommand += ", " + tourname;
		this.say(room, tourCommand);
		
		if (tourObject) {
			if (tourObject.tourrules) {
				this.say(room, "/tour rules " + tourObject.tourrules);
			}
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
		let text = "";
		let JSONresponse;
		let wasSuccessful = true;
		let lastMonthRank;
		let month = 6;
		let year = 2022;
		const defaultFormat = "gen8vgc2022";
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
		let defaultFormat = "gen8vgc2022";
		let text = "";
		if (this.isPM(room)) {
			room = toID(config.rooms[0]);

			if (tourJSON.hasOwnProperty(arg) && tourJSON[arg].sampleTeams.length) {
				this.mostRecentUserPM = toID(by);
				text = "/pminfobox " + this.mostRecentUserPM + ", " + this.generateHTMLSample(tourJSON[arg].formatname, tourJSON[arg].formatDescription, tourJSON[arg].sampleTeams, true, true);
			}
			else if (arg === "") {
				this.mostRecentUserPM = toID(by);
				text = "/pminfobox " + this.mostRecentUserPM + ", " + this.generateHTMLSample(tourJSON[defaultFormat].formatname, tourJSON[defaultFormat].formatDescription, tourJSON[defaultFormat].sampleTeams, true, true);
			}
			else {
				this.mostRecentUserPM = toID(by);
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
		}
		else if (tourJSON.hasOwnProperty(arg) && tourJSON[arg].sampleTeams.length) {
			text = "/addhtmlbox " + this.generateHTMLSample(tourJSON[arg].formatname, tourJSON[arg].formatDescription, tourJSON[arg].sampleTeams, true, false);
		}
		else if (arg === "") {
			text = "/addhtmlbox " + this.generateHTMLSample(tourJSON[defaultFormat].formatname, tourJSON[defaultFormat].formatDescription, tourJSON[defaultFormat].sampleTeams, true, false);
		}
		else if (arg === "all") {
			text = "/addhtmlbox ";
			let keys = Object.keys(tourJSON);
			
			for (const key in keys) {
				if (tourJSON[keys[key]].sampleTeams.length) {
					text += this.generateHTMLSample(tourJSON[keys[key]].formatname, tourJSON[keys[key]].formatDescription, tourJSON[keys[key]].sampleTeams, false, false);
				}
			}
		}
		else {
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
