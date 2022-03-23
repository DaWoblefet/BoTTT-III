exports.run = async (arg, by, room) => {
    const axios = require("axios");

    // Displays recent VGC usage stats. Also works in PM.
    let text = "";
    let JSONresponse;
    let wasSuccessful = true;
    let lastMonthRank;
    let month = 2;
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

    if (arg) // Pokemon is specified
    {
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
        else // has permissions for htmlbox
        {
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
    else // Generic links to usage stats
    {
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
};

module.exports.config = {
    aliases: ["usgae"]
};