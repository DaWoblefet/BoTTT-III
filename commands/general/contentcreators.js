exports.run = (arg, by, room) => {
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
};

module.exports.config = {
    aliases: ["cc", "creators"]
};