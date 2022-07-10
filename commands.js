"use strict";

/**
 * Bot commands are loaded from the /commands directory. The distinction between each category is purely for organizatal purposes.
 *
 * Modified by DaWoblefet for use with BoTTT III with original work by TalkTakesTime, Quinella, and Morfent.
 *
 * @license MIT license
 */
exports.commands = Object.assign(require("./commands/general.js").commands, require("./commands/fun.js").commands, require("./commands/developer.js").commands);