"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function npc() {
  this.message(`Hiding of blacklisted NPCs ${
    (config.blacklistNpcs = !config.blacklistNpcs) ? "en" : "dis"
  }abled`);
  saveConfig();
}

module.exports = npc;