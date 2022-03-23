exports.run = (arg, by, room) => {
    if (room === 'vgc') { return false; }
    this.say(room, "mish mish");

    if (Math.floor(Math.random() * 10) === 1) // 10% chance to roll
    {
        this.say(room, "/addhtmlbox <img src=\"https://images-ext-1.discordapp.net/external/jZ8e-Lcp6p2-GZb8DeeyShSvxT2ghTDz7nLMX8c1SKs/https/cdn.discordapp.com/attachments/320922154092986378/410460728999411712/getmished.png?width=260&height=300\" height=300 width=260>");
    };
};

module.exports.config = {
    aliases: []
};