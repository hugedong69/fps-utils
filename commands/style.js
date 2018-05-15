"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function style() {
  this.message(`Displaying of all players as wearing default costumes ${
    (config.showStyle = !config.showStyle) ? "en" : "dis"
  }abled, you will have to re-enter the zone for this to take effect`);
  saveConfig();
}

module.exports = style;