"use strict";
const {
  config
} = require("../utils");

function list() {
  this.message(`Hidden players: ${[...config.blacklistedNames]}`);
  this.message(`Hidden classes: ${[...config.hiddenClasses]}`);
  this.message(`Hidden roles: ${[...config.hiddenRoles]}`);
}

module.exports = list;
