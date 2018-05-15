"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function projectile(arg) {
  switch (arg.toLowerCase()) {
   case "all":
    this.message(`Hiding of ALL projectile effects ${
      (config.hideProjectiles = !config.hideProjectiles) ? "en" : "dis"
    }abled`);
    break;

   case "blacklist":
    this.message(`Hiding of BLACKLISTED projectile effects ${
      (config.blacklistProjectiles = !config.blacklistProjectiles) ? "en" : "dis"
    }abled`);
    break;

   default:
    return this.message(`Unrecognized subcommand "${arg}"`);
  }
  saveConfig();
}

module.exports = projectile;