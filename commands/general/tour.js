exports.run = async (arg, by, room) => {
    const tourJSON = require("./tourformats.json");
    // Creates a tournament with custom options. Sample teams are provided for each format when applicable.
    let arglist = arg.split(', ');

    if (arg === "reset" || arg === "restart") {
        hasTourStarted = false;
        this.say(room, "Tournament creation should be working again.");
        send("|/pm " + toID(by) + ", Please let DaWoblefet know tours were broken.");
        error("Tour reset was called. Better check it out. " + new Date().toLocaleString());
        return;
    }

    if (!hasTourStarted) {
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

        if (arglist[3] === undefined || isNaN(arglist[3])) {
            arglist[3] = "1";
        }

        if (tourObject) {
            tourformat = tourObject.tourformat;
            tourname = tourObject.tourname;
        }

        let tourCommand = "/tour create " + tourformat + ", " + arglist[1] + ", " + arglist[2] + ", " + arglist[3];
        if (tourname) { tourCommand += ", " + tourname; }
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
                this.say(room, '/addhtmlbox <div style="text-align: center"> <img src="https://www.smogon.com/media/zracknel-beta.svg.m.1" width="50" height="50"> <h3 style="display: inline">Official Smogon VGC Room Tournament</h3> <img src="https://www.smogon.com/media/zracknel-beta.svg.m.1" width="50" height="50"> <br> <p>See this <a href="https://www.smogon.com/forums/threads/official-room-tournaments-on-pokemon-showdown.3683264/#post-8837920" target="_blank" rel="noopener">Smogon VGC thread</a> for more details.</p> </div>')
            }
        }
    }
    else {
        this.say(room, "A tournament has already been started.");
    }
};

module.exports.config = {
    aliases: []
};