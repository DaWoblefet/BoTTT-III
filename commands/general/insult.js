exports.run = (arg, by, room) => {
    // Applies a random insult to the target user.
    let arglist = arg.split(',');

    // Gives myself and the bot insult immunity. Prevents sneaky UTF-8 similar looking characters intended to avoid the insult.
    if (toID(arglist[0]).includes("dawob") || toID(arglist[0]).includes("trey") || toID(arglist[0]).includes("leonard") || toID(arglist[0]).includes(toID(config.nick)) || /[^\u0000-\u007F]/g.test(arglist[0])) {
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
        send("|/pm " + toID(by) + ", You entered an invalid insult number, probably. Valid insult numbers are 0-" + (insultList.length - 1) + ".");
    }

    this.say(room, text);
};

module.exports.config = {
    aliases: []
};