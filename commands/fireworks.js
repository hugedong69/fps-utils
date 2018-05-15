"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function fireworks() {
  this.message(`Hiding of firework effects ${
    (config.hideFireworks = !config.hideFireworks) ? "en" : "dis"
  }abled`);
  saveConfig();
}

module.exports = fireworks;