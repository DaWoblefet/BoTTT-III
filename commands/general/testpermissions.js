exports.run = (arg, by, room) => {
    // Normal cases in VGC room
    this.say(room, "Normal cases in VGC");
    this.say(room, "Driver");
    this.say(room, this.canUse("joke", "vgc", "%ansena", "")); // 1
    this.say(room, this.canUse("custom", "vgc", "%ansena", "")); // 0
    this.say(room, this.canUse("samples", "vgc", "%ansena", "")); // 1
    this.say(room, this.canUse("tour", "vgc", "%ansena", "")); // 1

    this.say(room, "Voice");
    this.say(room, this.canUse("joke", "vgc", "+ansena", "")); // 0
    this.say(room, this.canUse("custom", "vgc", "+ansena", "")); // 0
    this.say(room, this.canUse("samples", "vgc", "+ansena", "")); // 1
    this.say(room, this.canUse("tour", "vgc", "+ansena", "")); // 1

    this.say(room, "Reg");
    this.say(room, this.canUse("joke", "vgc", " ansena", "")); // 0
    this.say(room, this.canUse("custom", "vgc", " ansena", "")); // 0
    this.say(room, this.canUse("samples", "vgc", " ansena", "")); // 2
    this.say(room, this.canUse("tour", "vgc", " ansena", "")); // 0

    // Normal cases not in VGC room
    this.say(room, "Normal cases not in VGC");
    this.say(room, "Driver");
    this.say(room, this.canUse("joke", "notvgc", "%ansena", "")); // 1
    this.say(room, this.canUse("custom", "notvgc", "%ansena", "")); // 0
    this.say(room, this.canUse("samples", "notvgc", "%ansena", "")); // 1
    this.say(room, this.canUse("tour", "notvgc", "%ansena", "")); // 1

    this.say(room, "Voice");
    this.say(room, this.canUse("joke", "notvgc", "+ansena", "")); // 0
    this.say(room, this.canUse("custom", "notvgc", "+ansena", "")); // 0
    this.say(room, this.canUse("samples", "notvgc", "+ansena", "")); // 1
    this.say(room, this.canUse("tour", "notvgc", "+ansena", "")); // 0

    this.say(room, "Reg");
    this.say(room, this.canUse("joke", "notvgc", " ansena", "")); // 0
    this.say(room, this.canUse("custom", "notvgc", " ansena", "")); // 0
    this.say(room, this.canUse("samples", "notvgc", " ansena", "")); // 2
    this.say(room, this.canUse("tour", "notvgc", " ansena", "")); // 0

    // Special case tests
    this.say(room, "Special cases");
    this.say(room, this.canUse("blog", "notvgc", "%ansena", "")); // 0
    this.say(room, this.canUse("blog", "vgc", "%ansena", "")); // 1
    this.say(room, this.canUse("blog", "vgc", "%mish", "")); // 0
    this.say(room, this.canUse("blog", "notvgc", "%mish", "")); // 0
    this.say(room, this.canUse("tour", "vgc", " legavgc", "vgc13")); // 1
    this.say(room, this.canUse("custom", ",notvgc", "+blarajan", "[vgc] hello")); // 1
};

module.exports.config = {
    aliases: []
};

