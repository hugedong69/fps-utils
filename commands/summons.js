"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function summons() {
  this.message(`Hiding of summoned NPCs ${
    (config.hideAllSummons = !config.hideAllSummons) ? "en" : "dis"
  }abled`);
  saveConfig();
}

module.exports = summons;