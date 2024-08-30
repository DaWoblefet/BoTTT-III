"use strict";

const STRIP_COMMANDS = true;

exports.commands = {
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

		this.say(room, text, STRIP_COMMANDS);
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
			"What do you call someone who immigrates to Sweden? Artificial Swedener!",
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
			"Why did the robber have to retire? He just couldn't take it anymore!",
			"I used to think I was indecisive, but now, I'm not so sure."
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

		this.say(room, text, STRIP_COMMANDS);
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
		this.say(room, "get MISHED kiddo");

		const rand = Math.floor(100 * Math.random());
		if (rand % 10 === 0) {
			if (rand > 50) {
				this.say(room, "!show https://i.ibb.co/TLz2fsn/uh-oh.png");
			} else {
				this.say(room, "!show https://www.youtube.com/watch?v=xmp589AZqEE");
			}
		}
	},
    
	blog: function(arg, by, room) {
		this.say(room, "/addhtmlbox <a href='https://spo.ink/ansena'>ansena's blog</a>");
	},

	bannbuild: function(arg, by, room) {
		this.say(room, "Bennbuild has been **banned** from the VGC room, Pokémon Showdown!, the Play Pokémon Program, and all other Pokémon related platforms.");
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
			<img src = "https://i.ibb.co/Zx8JqhM/platypusprowl.gif" height = "175" width = "170"> \
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
				<a href = "https://www.youtube.com/watch?v=buc64u6Q_oA"><img src = "https://i.ibb.co/0fjCs5w/acquirethesire.gif" width="360" height="202"></a> \
			</div> \
			<div style = "display: inline-block; vertical-align: 50%; padding-left: 10px;"> \
				<img src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="display: block; padding-bottom: 20px;"> \
				<img class = "fa fa-spin" src = "https://play.pokemonshowdown.com/sprites/ani/quagsire.gif" width="48" height="77" style="display: block;"> \
			</div> \
		</div>';
		this.say(room, "/addhtmlbox " + text);
	},

	clod: "clodsire",
	clodsire: function(arg, by, room) {
		let text =
		'<div style = "width: 590px; margin: auto; margin-bottom: 5px;"> \
		<a href = "https://www.youtube.com/watch?v=ZVllS9y6mBg" style = "text-align: center; font-size: 200%; display: block; color: black;border: 3px solid black; margin: auto; border-radius: 10px; background-color: #977f7b; padding: 5px 0;"> \
						<psicon pokemon="wooperpaldea"> \
						<strong>Applaud the Clod</strong> \
						<psicon pokemon="wooperpaldea"> \
		</a> \
		</div> \
		<div style = "width: 590px; margin: auto;"> \
		<div style = "display: inline-block; vertical-align: 50%; padding-right: 10px;"> \
				<img src = "https://play.pokemonshowdown.com/sprites/gen5/clodsire.png" width="96" height="96" style="transform: scaleX(-1); display: block; padding-bottom: 20px;"> \
				<img src = "https://play.pokemonshowdown.com/sprites/gen5/clodsire.png" width="96" height="96" style="transform: scaleX(-1); display: block;"> \
		</div> \
				<div style = "display: inline-block;"> \
						<a href = "https://www.youtube.com/watch?v=ZVllS9y6mBg"><img src = "https://i.ibb.co/tht6ykw/applaudtheclod.gif" width="360" height="202"></a> \
				</div> \
				<div style = "display: inline-block; vertical-align: 50%; padding-left: 10px;"> \
						<img src = "https://play.pokemonshowdown.com/sprites/gen5/clodsire.png" width="96" height="96" style="display: block; padding-bottom: 20px;"> \
						<img class = "fa fa-spin" src = "https://play.pokemonshowdown.com/sprites/gen5/clodsire.png" width="96" height="96" style="display: block;"> \
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

	wochien: function(arg, by, room) {
		let text = "<img src = \"https://i.snipboard.io/W9cDaj.jpg\" width=276 height=246 style='border: 1px solid black;'>";
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
		this.say(room, text, STRIP_COMMANDS);
	},

	bacon: function(arg, by, room) {
		let text = '/addhtmlbox <img src = "https://play.pokemonshowdown.com/sprites/ani-shiny/yveltal.gif" width = 201 height = 188>';
		this.say(room, text);
	},

	toothpaste: function(arg, by, room) {
		let text = '/addhtmlbox <img src = "https://play.pokemonshowdown.com/sprites/ani-shiny/zygarde.gif" width = 96 height = 107>';
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

	gauntlet: function(arg, by, room) {
		let challengeString = "";
		if (!arg) {
			challengeString = "The National Dex AG Gauntlet is challenge where I attempt to win 10 consecutive games in National Dex AG. Defeating me at any point will result in the gauntlet ending for that day and the player winning a <strong>special prize</strong>!";
		} else if (arg === 'start') {
			challengeString = "I challenge Lobby to a game of National Dex AG! If you can defeat me, I'll give you a <strong>special prize</strong>!";
		} else if (arg.startsWith('finish')){
			const arglist = arg.split(', ');
			if (arglist.length < 2 || isNaN(parseInt(arglist[1]))) {
				this.say(room, "/pm " + by + ", You forgot to include the number of wins you finished at.");
				return;
			}
			challengeString = "I finished " + arglist[1] + "-0 vs Lobby in National Dex AG! That means nobody wins the <strong>special prize</strong> :(. Better luck next time!";
		} else if (!isNaN(parseInt(arg))) {
			challengeString = "I am " + arg + "-0 vs Lobby in National Dex AG! If you can defeat me, I'll give you a <strong>special prize</strong>!";
		} else {
			this.say(room, "/pm " + by + ", Invalid argument for gauntlet command.");
			return;
		}
		let text =
		'<div class="infobox"> \
			<h1 style="font-size: 1.75em;">National Dex AG Gauntlet</h1> \
			<p><i>Hosted by DaWoblefet</i></p> \
			<img src="https://play.pokemonshowdown.com/sprites/trainers-custom/dawoblefet.png" style="float: left" height="80" width="80"> \
			<p>' + challengeString + '</p> \
			<details> \
				<summary>FAQs</summary> \
				<p> \
					<strong>How do I participate?</strong> \
					<br> \
					Send me a challenge in [Gen 9] National Dex AG! \
				</p> \
				<p> \
					<strong>Why aren\'t you accepting my challenge?</strong> \
					<br> \
					I accept challenges on a first-come, first-served basis. If you have played with me many times in the past, I may also give newer players a chance first. I can only play one game at a time, so please be patient! \
				</p> \
				<p> \
					<strong>Do you accept rematches?</strong> \
					<br> \
					No. There are usually lots of people waiting in line to play, and I want to give as many people a turn as I can. You can rematch in another gauntlet, though! \
				</p> \
				<p> \
					<strong>What is the special prize?</strong> \
					<br> \
					You\'ll find out if you win! \
				</p> \
				<p> \
					<strong>Do I have to beat you to win the special prize?</strong> \
					<br> \
					Yes, you must defeat me. Ties do not count. \
				</p> \
				<p> \
					<strong>Can I challenge you on an alt?</strong> \
					<br> \
					Not if you are trying to trick me into thinking you are somebody else. \
				</p> \
				<p> \
					<strong>Have you ever been defeated before?</strong> \
					<br> \
					Yes! The Hall of Fame section below catalogs my losses since I started maintaining a list. \
				</p> \
			</details> \
			<details> \
			<summary>Hall of Fame</summary> \
			<p>Since the creation of this Hall of Fame, the following users have defeated me in the National Dex AG Gauntlet:</p> \
			<ul> \
				<li>Mean Mice</li> \
				<li>abyssalcrusader27</li> \
				<li>Fuckitweballhard</li> \
				<li>bydy2</li> \
				<li>u43i4r</li> \
				<li>undefeatedAGenius</li> \
				<li>Elec-ant1234</li> \
				<li>f1r35t0rm_96</li> \
				<li>slainey</li> \
				<li>Dregone</li> \
				<li>wafflecone67</li> \
				<li>Future king of ou</li> \
				<li>Zabertooth Tiger</li> \
				<li>mardydu</li> \
				<li>1hfkqhwhrelk%◕‿‿◕%</li> \
				<li>Friendship is key</li> \
			</ul> \
			</details> \
			<div style="clear: both"></div> \
		</div>';
		this.say(room, "/adduhtml ndaggauntlet, " + text);
	}
};
