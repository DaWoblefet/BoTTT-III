
exports.run = async (arg, by, room) => {
    this.say(room, "/uno create 10");
    this.say(room, "/uno autostart 30");
    let timer = toID(by) === "dingram" ? 5 : 10;
    this.say(room, "/uno timer " + timer);
};

module.exports.config = {
    aliases: []
};