exports.run = (arg, by, room) => {
    info(config.nick + " terminated at " + new Date().toLocaleString());
    process.exit(-1);
};

module.exports.config = {
    aliases: []
};