exports.run = (arg, by, room) => {
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
};

module.exports.config = {
    aliases: []
};