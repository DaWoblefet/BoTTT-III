exports.run = (arg, by, room) => {
    // Randomly picks one of my very funny jokes.
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
};

module.exports.config = {
    aliases: []
};