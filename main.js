"use strict";

/**
 * This is the main file for the Pokemon Showdown bot.
 *
 * Modified by DaWoblefet for use with BoTTT III with original work by TalkTakesTime, Quinella, and Morfent.
 *
 * Some parts of this code are taken from the Pokémon Showdown server code, so credits also go to Guangcong Luo and other Pokémon Showdown contributors.
 * https://github.com/smogon/pokemon-showdown
 *
 * @license MIT license
 */


// Logs various bits of information to the console based on config settings.
global.info = function(text) {
	if (config.debuglevel > 3) return;
	if (!colors) global.colors = require("colors");
	console.log("info".cyan + "  " + text);
};

global.debug = function(text) {
	if (config.debuglevel > 2) return;
	if (!colors) global.colors = require("colors");
	console.log("debug".blue + " " + text);
};

global.recv = function(text) {
	if (config.debuglevel > 0) return;
	if (!colors) global.colors = require("colors");
	console.log("recv".grey + "  " + text);
};

global.cmdr = function(text) { // Receiving commands
	if (config.debuglevel !== 1) return;
	if (!colors) global.colors = require("colors");
	console.log("cmdr".grey + "  " + text);
};

global.dsend = function(text) {
	if (config.debuglevel > 1) return;
	if (!colors) global.colors = require("colors");
	console.log("send".grey + "  " + text);
};

global.error = function(text) {
	if (!colors) global.colors = require("colors");
	console.log("error".red + " " + text);
};

global.ok = function(text) {
	if (config.debuglevel > 4) return;
	if (!colors) global.colors = require("colors");
	console.log("ok".green + "    " + text);
};

// Turns string to its lowercase equivalent, then removes all non-alphanumeric characters.
global.toID = function(text) {
	return text.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Check if everything that is needed is available
try {
	require("colors");
}
catch (e) {
	console.log("Dependencies are not installed! Please run `npm install` first.");
	process.exit(-1);
}

// First dependencies and welcome message
const { inspect } = require("util");
global.colors = require("colors");

console.log("------------------------------------".yellow);
console.log("| Welcome to Pokemon Showdown Bot! |".yellow);
console.log("------------------------------------".yellow);
console.log();

// Config and config.js watching...
global.fs = require('fs');
if (!('existsSync' in fs)) {
	fs.existsSync = require('path').existsSync;
}

if (!fs.existsSync("./config.js")) {
	error("config.js doesn't exist; are you sure you renamed config-example.js to config.js?");
	process.exit(-1);
}

global.config = require("./config.js");

let checkCommandCharacter = function() {
	if (!/[^a-z0-9 ]/i.test(config.commandcharacter)) {
		error("invalid command character; should at least contain one non-alphanumeric character");
		process.exit(-1);
	}
};

checkCommandCharacter();

let watchFile = function() {
	try {
		return fs.watchFile.apply(fs, arguments);
	}
	catch (e) {
		error("your version of node does not support `fs.watchFile`");
	}
};

if (config.watchconfig) {
	watchFile("./config.js", function(curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve("./config.js")];
			config = require("./config.js");
			info("reloaded config.js");
			checkCommandCharacter();
		} catch (e) {}
	});
}

// The actual connection.
info("starting server");

let WebSocketClient = require("websocket").client;
global.Commands = require("./commands.js").commands;
global.Parse = require("./parser.js").parse;
global.Aliases = require("./aliases.js").aliases;
global.Connection = null;
const MESSAGE_THROTTLE = 300;

let queue = [];
let dequeueTimeout = null;
let lastSentAt = 0;

global.send = function(data) {
	if (!data || !Connection.connected) return false;

	let now = Date.now();
	if (now < lastSentAt + MESSAGE_THROTTLE - 5) {
		queue.push(data);
		if (!dequeueTimeout) {
			dequeueTimeout = setTimeout(dequeue, now - lastSentAt + MESSAGE_THROTTLE);
		}
		return false;
	}

	if (!Array.isArray(data)) {
		data = [data.toString()];
	}
	data = JSON.stringify(data);
	dsend(data);
	Connection.send(data);

	lastSentAt = now;
	if (dequeueTimeout) {
		if (queue.length) {
			dequeueTimeout = setTimeout(dequeue, MESSAGE_THROTTLE);
		}
		else {
			dequeueTimeout = null;
		}
	}
};

function dequeue() {
	send(queue.shift());
}

let connect = function(retry) {
	if (retry) {
		info("retrying...");
	}

	let ws = new WebSocketClient();

	ws.on("connectFailed", function(err) {
		error("Could not connect to server " + config.server + ": " + inspect(err));
		info("retrying in one minute");

		setTimeout(function() {connect(true);}, 60000);
	});

	ws.on("connect", function(con) {
		Connection = con;
		ok("connected to server " + config.server);

		con.on("error", function(err) {
			error("connection error: " + err);
		});

		con.on("close", function() {
			error("connection closed: " + inspect(arguments) + " at " + new Date().toLocaleString());
			info("retrying in " + config.timeout + " seconds");

			setTimeout(function() {connect(true);}, config.timeout * 1000);
		});

		con.on("message", function(response) {
			if (response.type !== 'utf8') return false;
			let message = response.utf8Data;
			recv(message);

			// SockJS messages sent from the server begin with 'a'
			// this filters out other SockJS response types (heartbeats in particular)
			if (message.charAt(0) !== 'a') return false;
			Parse.data(message);
		});
	});

	// The connection itself
	let id = Math.floor(Math.random() * 1000);
	let chars = "abcdefghijklmnopqrstuvwxyz0123456789_";
	let str = "";
	for (let i = 0, l = chars.length; i < 8; i++) {
		str += chars.charAt(Math.floor(Math.random() * l));
	}

	let conStr = "ws://" + config.server + ':' + config.port + "/showdown/" + id + '/' + str + "/websocket";
	info("connecting to " + conStr + " - secondary protocols: " + (config.secprotocols.join(", ") || "none"));
	ws.connect(conStr, config.secprotocols);
};

connect();