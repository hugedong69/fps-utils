"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function hit(arg) {
  switch (arg.toLowerCase()) {
   case "me":
    this.message(`Hiding of the players skill hits ${
      (config.hitMe = !config.hitMe) ? "en" : "dis"
    }abled`);
    break;

   case "other":
    this.message(`Hiding of other players skill hits ${
      (config.hitOther = !config.hitOther) ? "en" : "dis"
    }abled`);
    break;

   case "damage":
    this.message(`Hiding of the players skill damage numbers ${
      (config.hitDamage = !config.hitDamage) ? "en" : "dis"
    }abled`);
    break;

   default:
    return this.message(`Unrecognized subcommand "${arg}"`);
  }
  saveConfig();
}

module.exports = hit;