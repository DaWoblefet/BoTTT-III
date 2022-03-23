exports.run = async (arg, by, room) => {
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
};

module.exports.config = {
    aliases: ["sample"]
};