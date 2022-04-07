"use strict";

/**
 * This is the file where the bot commands are located.
 *
 * Modified by DaWoblefet for use with BoTTT III with original work by TalkTakesTime, Quinella, and Morfent.
 *
 * @license MIT license
 */

const { inspect } = require("util");
const axios = require("axios");
const tourJSON = require("./tourformats.json");

exports.commands = {
	// Information/Help Commands

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

	/**
	 * Developer Commands
	 * These commands are useful for bot upkeep, or generally speaking, any arbitrary action.
	 * They are very powerful and not intended for the average user.
	 */

	// Refreshes the command list and parser. To refresh something else, you must stop the bot completely. Only dev has access.
	rl: "reload",
	reload: function(arg, by, room) {
		try {
			this.uncacheTree("./commands.js");
			Commands = require("./commands.js").commands;
			this.uncacheTree("./parser.js");
			Parse = require('./parser.js').parse;
			this.say(room, "Commands reloaded.");
		}
		catch (e) {
			error("Failed to reload: " + inspect(e));
		}
	},

	/**
	 * Tells BoTTT III to say whatever you want, including PS commands. Restricted to room owners. Must be done in PM.
	 * To use: .custom [room] thing you want BoTTT III to say/do
	 * Example: ".custom [vgc] !dt pikachu" will cause BoTTT III to say !dt pikachu in the VGC room.

	 * If you need to display HTML or do some other sequence of commands that is too long for a PM, you can link the bot
	 * a pastebin.com/raw/ link and it will read and execute that instead.
	 * Example: ".custom [vgc] https://pastebin.com/raw/theRestOfThePastebinURL"
	 */
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

	// General commands

	// Tells the bot something to say, and it says it. Won't say commands.
	tell: "say",
	say: function(arg, by, room) {
		this.say(room, stripCommands(arg));
	},

	// Creates a tournament with custom options. Sample teams are provided for each format when applicable.
	tour: function(arg, by, room) {
		let arglist = arg.split(', ');

		if (arg === "reset" || arg === "restart") {
			hasTourStarted = false;
			this.say(room, "Tournament creation should be working again.");
			send("|/pm " + toID(by) + ", Please let DaWoblefet know tours were broken.");
			error("Tour reset was called. Better check it out. " + new Date().toLocaleString());
			return;
		}

		if (hasTourStarted) {
			this.say(room, "A tournament has already been started.");
			return;
		}

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
			case "21":
			case "s10":
			case "series10":
				tourObject = tourJSON["gen8vgc2021series10"];
				break;
			case "vgc21":
			case "vgc2021":
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

	// Applies a random insult to the target user.
	insult: function(arg, by, room) {
		let arglist = arg.split(',');

		// Gives myself and the bot insult immunity. Prevents sneaky UTF-8 similar looking characters intended to avoid the insult.
		if (toID(arglist[0]).includes("dawob")
			|| toID(arglist[0]).includes("trey")
			|| toID(arglist[0]).includes("leonard")
			|| toID(arglist[0]).includes(toID(config.nick))
			|| /[^\u0000-\u007F]/g.test(arglist[0])) {
			arglist[0] = by.substring(1, by.length);
		}

		let insultList = [
			arglist[0] + " is worse than Bright Size.",
			arglist[0] + " has more Play Points than CP.",
			arglist[0] + " is the reason we have to put instructions on shampoo.",
			"Roses are red, violets are blue. If " + arglist[0] + " was a Pokemon, I wouldn't choose you.",
			arglist[0] + " uses the word objectively to describe subjective things.",
			"They say opposites attract. I hope " + arglist[0] + " meets someone who is good-looking, intelligent, and cultured.",
			arglist[0] + " can't even win with 5-move Volcarona.",
			arglist[0] + " calls Kommo-o \"cowmoo\".",
			arglist[0] + "'s social life is as exciting as the derivative of e^^x^^.",
			"The intersection of " + arglist[0] + "'s brain and reality is the null set.",
			"Trying to understand " + arglist[0] + "'s teambuilding decisions is more complex than solving the P vs. NP problem.",
			arglist[0] + " is the type of person who stares at a can of orange juice because it says \"concentrate\".",
			arglist[0] + " uses Facade Snorlax on teams with Tapu Fini.",
			arglist[0] + " would struggle to pour water out of a boot with the directions on the heel.",
			arglist[0] + " has Van Gogh's ear for music.",
			"__[[]]_NO SHOW__ outplaced " + arglist[0] + " in Player's Cup.",
			"How many of " + arglist[0] + " does it take to change a lightbulb? Just one - all they have to do is hold the lightbulb in place while the world revolves around them.",
			arglist[0] + " is like a cloud. When they disappear, it's a beautiful day!",
			"I've seen people like " + arglist[0] + " before, but I had to pay an admission.",
			"Why did " + arglist[0] + " catch hypothermia? They went to see the movie \"Closed for Winter\" at the drive-in theater."
		];

		let text = "";

		let insultNum = parseInt(arglist[1]);
		if (!arglist[1]) {
			let rand = Math.floor(insultList.length * Math.random());
			insultNum = rand;
		}

		text = insultList[insultNum];
		if (insultNum === 0 && arglist[0] === "Bright Size") {
			text = "Bright Size is worse than Bright Size. If you think about it long enough, you'll realize you thought too long.";
		}

		if (!text) {
			text = arglist[0] + " is bad and should feel bad.";
			send("|/pm " + toID(by) +  ", You entered an invalid insult number, probably. Valid insult numbers are 0-" + (insultList.length - 1) + ".");
		}

		this.say(room, text);
	},

	// Randomly picks one of my very funny jokes.
	joke: function(arg, by, room) {
		let jokeList = [
			"What's the difference between a jeweler and a jailor? One sells watches, and the other watches cells!",
			"Why do seagulls fly over the sea? Because if they flew over the bay, they'd be bagels!",
			"Why is it a waste of time to talk to a cow? Because it just goes in one ear and out the udder!",
			"Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
			"What do prisoners use to call each other? Cell phones!",
			"What do you call a bee that can't make up its mind? A maybe!",
			"What do you call a bee that lives in America? A USB!",
			"What do you call an everyday potato? A commentator!",
			"Why did the partially blind man fall down the well? Because he couldn't see that well.",
			"What's the difference between a dog and a marine biologist? One wags its tail, and the other tags a whale!",
			"Where do ants go when it's hot outside? **Ant**arctica!",
			"What happened when the oceans raced each other? They tide!",
			"What do you call a chicken that calculates how to cross the road? A mathemachicken!",
			"A woman in labor suddenly shouted, \"Shouldn't! Wouldn't! Couldn't! Didn't! Can't!\". \"Don't worry\", said the doctor, \"those are just contractions.\"",
			"Why did the sun not go to college? It already had three million degrees!",
			"What's the difference between a diameter and a radius? A radius!",
			"What did the scientist say when he found two isotopes of helium? HeHe",
			"Why do Marxists only drink bad tea? Because all proper tea is theft.",
			"What's a frog's favorite drink? Diet croak!",
			"As I handed Dad his 50th birthday card, he looked at me with tears in his eyes and said, \"You know, one would have been enough.\"",
			"I'd tell you a Fibonacci joke, but it's probably as bad as the last two you've heard combined.",
			"Why don't Americans switch from using pounds to kilograms? Because there'd be a mass confusion.",
			"Where do fish go to work at? The offish!",
			"What do you call two friends who both like math? Algebros!",
			"What happened to the man that injested plutonium? He got atomicache!",
			"My sister bet me $100 I couldn't build a car out of spaghetti. You should have seen her face when I drove right pasta!",
			"Did you hear people aren't naming their daughters Karen nowadays? Soon there won't be a Karen the world.",
			"Why is justice best served cold? Because if it was served warm, it would be just water!",
			"Last week, I decided I was going to enter the Worlds Tightest Hat competition. I just hope I can pull it off...",
			"What do you call a beehive where bees can never leave? Un-bee-leaveable!",
			"How much does it cost for a pirate to get their ears pierced? A buccaneer!",
			"The minus button on my calculator is broken. On the plus side, it works.",
			"Gravity is one of the fundamental forces in the universe. If you removed it, you'd get gravy.",
			"Did you know that if you cut off your left arm, your right arm is left?",
			"The other day, I spotted an albino dalmatian. I figured it was the least I could do for him.",
			"What is the loudest pet? A trum**pet**!",
			"What's the best way to cook an alligator? In a crockpot!",
			"What's the best way to make a pirate angry? Remove the p!",
			"Last night, my wife was feeling pretty emotional, and she started coloring on my upper arm. I guess she just needed a shoulder to crayon.",
			"Did you hear about the marriage of the invisible man and the invisible woman? I'm just not sure what they saw in each other.",
			"Where do you take a boat when it gets sick? To the doc!",
			"My eye doctor called and said the results of my last appointment were finished. When I asked if I could see them, she said, \"probably not\".",
			"A priest, a pastor, and a rabbit walk into a bar. The rabbit says, \"I must be a typo!\"",
			"Why was the tennis club's website down? They had problems with their server.",
			"What's the best time to buy a bird? When it's going cheep!",
			"My friend hates it when I put his chocolate bars in other chocolate bar wrappers. It really gets his Snickers in a Twix.",
			"There is a new government intiative to replace all cars with paper by 2030. This comes after a recently released study showing that 99% of car accidents could be prevented if all vehicles were stationery.",
			"My brother can't seem to get anything completed. They say he's got a black belt in partial arts.",
			"Did you hear Old MacDonald had a son in the military? His name was E.I. G.I. Joe.",
			"What do you call someone who immigrates to Sweden? Artifical Swedener!",
			"My son told me he wanted to study burrowing rodents in college. I told him to gopher it!",
			"In breaking news, the new Peek-a-Boo virus has infected a local baby. The baby was rushed to the ICU.",
			"I asked a librarian if they had any books about paranoia. Whispering, she replied, \\\\\"They're right behind you\".\\\\",
			"What did the Spanish firefighter name his two sons? José and Hose B!",
			"My fear of palindromes is really starting to affect my life, so I asked my doctor if they could prescribe me anything. Unfortunately, my doctor gave me Xanax :(",
			"I've been training to be a magician. For my first trick, I will make the following things disappear:",
			"What do pear trees do before they grow their fruit? They pre-pear!",
			"What do you call a wandering Neanderthal? A meanderthal!",
			"Did you hear about the man who tied a criminal to the dock? He was arrested for harboring a fugitive!",
			"Did you hear about the bad rainbow who was committing crimes? It got sent to prism. Luckily for the rainbow, it was a light sentence.",
			"What do you call an egg found on the beach? San Diego!",
			"How do you help a female sibling? Assister!",
			"A guy came into my office claiming he was able to turn people into windmills. I immediately became a huge fan!",
			"Why did the ghost go to the bar? To get some booze!",
			"I'm super upset. Somebody glued my deck of cards together, and I just don't know how to deal with it!",
			"My friend couldn't afford to pay her water bill, so I sent her a \"get well soon\" card.",
			"What's the difference between in-laws and outlaws? Outlaws are wanted!",
			"I went to the zoo yesterday and saw a bagel in a cage. The zookeeper informed me it was bread in captivity!",
			"Why did the robber have to retire? He just couldn't take it anymore!"
		];

		let jokeNum = arg === "latest" ? jokeList.length - 1 : parseInt(arg);

		if (!arg) {
			let rand = Math.floor(jokeList.length * Math.random());
			jokeNum = rand;
		}

		let text = jokeList[jokeNum];
		if (!text) {
			text = "le epic funny joke.";
			send("|/pm " + toID(by) + ", You entered an invalid joke number, probably. Valid joke numbers are 0-" + (jokeList.length - 1) + ".");
		}

		this.say(room, text);
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
		let month = 3;
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

	objective: "objectively",
	objectively: function(arg, by, room) {
		let text = 
		"Something is \"objective\" when it is true independently of personal feelings or opinions, instead based on hard facts. For example, Flamethrower objectively has higher accuracy than Fire Blast, and Fire Blast objectively has a higher Base Power than Flamethrower. \
		<br><br> \
		Subjective refers to personal preferences, opinions, or feelings. Anything subjective is subject to interpretation. For example, you might think Flamethrower is better than Fire Blast, but another player might think Fire Blast is better; the opinion is subjective. \
		<br><br> \
		That's not to say opinions are bad! It's also ok to put forth reasoning into your opinions and defend them. It's not correct, however, to say some opinion you have is objectively true. \
		";
		this.say(room, "/addhtmlbox " + text);
	},

	mish: function(arg, by, room) {
		if (room === 'vgc') return false;
		this.say(room, "get MISHED kiddo");

		if (Math.floor(Math.random() * 10) === 1) { // 10% chance to roll
			this.say(room, "/addhtmlbox <img src=\"https://images-ext-1.discordapp.net/external/jZ8e-Lcp6p2-GZb8DeeyShSvxT2ghTDz7nLMX8c1SKs/https/cdn.discordapp.com/attachments/320922154092986378/410460728999411712/getmished.png?width=260&height=300\" height=300 width=260>");
		}
	},
	blog: function(arg, by, room) {
		this.say(room, "/addhtmlbox <a href='https://spo.ink/ansena'>ansena's blog</a>");
	},
	chef: function(arg, by, room) {
		this.say(room, "!dt sheer cold");
	},
	platypus: function(arg, by, room) {
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
	},
	epic: function(arg, by, room) {
		this.say(room, "gaming");
	},
	nom: function(arg, by, room) {
		this.say(room, "Player not recognized. Perhaps you meant **seaco**.");
	},
	conics: function(arg, by, room) {
		this.say(room, "!dt mudkip");
	},
	diglett: function(arg, by, room) {
		let text = 
		'<marquee scrollamount = "15">';
		for (let i = 0; i < 13; i++) {
			text += '	<img src = "https://play.pokemonshowdown.com/sprites/ani/diglett.gif" class = "fa fa-spin" width = "43" height = "35">';
		}
		//D I G L E T T in emoji
		text +=
		'	<img src="https://images.emojiterra.com/twitter/v11/512px/1f1e9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ee.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ec.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f1.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ea.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
		</marquee> \
		<center> \
			<span style = "font-size: 0.9em">Moves Like Diglett | Eye of the Diglett | I\'ll Make a Diglett Out of You</span> \
		</center> \
		<center> \
			Click the Diglett -&gt;\
			<a href="https://youtu.be/6Zwu8i4bPV4"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			<a href="https://youtu.be/8LYwT9Nf1Ic"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			<a href="https://youtu.be/uzdvnB8SJV8"><img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/578a8319-92b6-4d81-9d5f-d6914e6535a0/d5o541m-54dae5d4-710c-44d4-a898-71ea71d7bd28.jpg" width="85" height="100"></a> \
			&lt;- Click the Diglett \
		</center> \
		<marquee scrollamount = "15"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1e9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ee.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ec.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f1.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1ea.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
			<img src="https://images.emojiterra.com/twitter/v11/512px/1f1f9.png" class="fa fa-spin" width="43" height="35"> \
		';
		for (let i = 0; i < 13; i++) {
			text += '	<img src = "https://play.pokemonshowdown.com/sprites/ani-back/diglett.gif" class = "fa fa-spin" width = "43" height = "35">';
		}
		text +=
		'</marquee>';
		this.say(room, "/addhtmlbox " + text);
	},
	sire: "quagsire",
	quagsire: function(arg, by, room) {
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
	},
	thinking: function(arg, by, room) {
		let text = "<img src = \"https://i.imgur.com/vXbla1s.png\" width=24 height=27>";
		this.say(room, "/addhtmlbox " + text);
	},
	genius: function(arg, by, room) {
		let text = "<img src = \"https://cdn.discordapp.com/emojis/403682643012616202.png\" width=50 height=50>";
		this.say(room, "/addhtmlbox " + text);
	},
	ungenius: function(arg, by, room) {
		let text = "<img src = \"https://cdn.discordapp.com/emojis/418886687180062720.png\" width=50 height=50>";
		this.say(room, "/addhtmlbox " + text);
	},
	sunglasses: function(arg, by, room) {
		let text = "<img src = \"https://i.snipboard.io/a6LIdY.jpg\" width=50 height=50>";
		this.say(room, "/addhtmlbox " + text);
	},
	tympole: function(arg, by, room) {
		let text = "<img src = \"https://cdn.discordapp.com/emojis/483997875181715456.png\" width=32 height=32 style='border: 1px solid black;'>";
		this.say(room, "/addhtmlbox " + text);
	},
	delet: function(arg, by, room) {
		this.say(room, arg + " **deleted**.");
	},
	b: function(arg, by, room) {
		let text;
		const bEmoji = "\ud83c\udd71\ufe0f";
		if (arg.match(/(b|B)/gm)) {
			text = arg.replace(/(b|B)/g, bEmoji);
		}
		else {
			text = bEmoji;
		}
		if (room.charAt(0) != ",") {
			text = "/addhtmlbox " + text;
		}
		this.say(room, text);
	},
	bacon: function(arg, by, room) {
		let text = '/addhtmlbox <img src = "https://play.pokemonshowdown.com/sprites/ani-shiny/yveltal.gif" width = 201 height = 188>';
		this.say(room, text);
	},
	vgc: function(arg, by, room) {
		let text = 'indeed \ud83c\udd71\ufe0frother, vgc';
		this.say(room, text);
	},
	dynamax: async function(arg, by, room) {
		let arglist = arg.split(', ');
		arglist[0] = arglist[0].toLowerCase().replace("'", "");
		let pokemonSprite = "https://play.pokemonshowdown.com/sprites";
		if (arglist[1] && arglist[1] === 'afd') {
			pokemonSprite += '/afd/' + arglist[0] + ".png";
		} else {
			pokemonSprite += '/ani/' + arglist[0] + ".gif";
		}

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
			<img src = "https://steamuserimages-a.akamaihd.net/ugc/933813375174289297/19F16DBEDED8FF15F8D969EE714BD1319149EB9D/" height = "'+ (height * 5) +'" width = "' + (width * 5) + '"> \
			<img src = "' + pokemonSprite + '" height = "' + (height * 5) + '" width = "' + (width * 5) + '" style = "position: absolute; top: 0%; left: 0%"> \
		</div>';

		this.say(room, "/addhtmlbox " + text);
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
	bo3: function(arg, by, room) {
		let isPM = this.isPM(room);
		if (isPM) {
			room = toID(config.rooms[0]);
			this.mostRecentUserPM = toID(by);
		}
		let text;
		let arglist = arg.split(', ');
		switch (arglist[0]) {
			case "":
			case "help":
				text = isPM ? "/pminfobox " + this.mostRecentUserPM + ", " + this.generateBO3Help(isPM) : "/addhtmlbox " + this.generateBO3Help(isPM);
				break;
			case "search":
				// will need split up
				text = "/pminfobox " + this.mostRecentUserPM + ", " + "<button class = 'button' name = 'send' value = '/pm Expecto Botronum, I challenge you to a Series 8 best-of-three!&#13;/challenge Expecto Botronum, gen8vgc2021'><strong>Challenge Expecto Botronum&#13;[Series 8]</strong></button>";
				break;
			case "add":
			case "change":
				const startingMessage = arg === 'add' ? "You have been added to the bo3 list " : "Your preferences have been updated ";
				text = "/pm " + by + ", " + startingMessage + "with the formats " + "[would be here]";
				break;
			case "remove":
				text = "/pm " + by + ", You have been removed from the bo3 list.";
				break;
			case "view":
				break;
		}
		this.say(room, text);
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
