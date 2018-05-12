"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function effects(arg) {
  switch (arg.toLowerCase()) {
   case "all":
    this.message(`Hiding of ALL abnormality effects on players ${
      (config.hideAllAbnormalities = !config.hideAllAbnormalities) ? "en" : "dis"
    }abled`);
    break;

   case "blacklist":
   case "black":
    this.message(`Hiding of BLACKLISTED abnormality effects ${
      (config.blacklistAbnormalities = !config.blacklistAbnormalities) ? "en" : "dis"
    }abled`);
    break;

   default:
    return this.message(`Unrecognized subcommand "${arg}"`);
  }
  saveConfig();
}

module.exports = effects;