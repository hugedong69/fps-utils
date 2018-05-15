"use strict";
const Command = require("command");
const fpsUtilsCommands = require("./commands");
const { EventEmitter, init } = require("events");
const addEventListeners = require("./event-listeners");
const addHooks = require("./hooks");

function FpsUtils2(dispatch) {
  init.call(this);

  (this.cmd = Command(dispatch)).add("fps", fpsUtilsCommands, this);

  this.dispatch = dispatch;
  this.hiddenNpcs = new Map;
  this.hiddenUsers = new Map;
  this.spawnedPlayers = new Map;

  addHooks(this);
  addEventListeners(this);
}

function message(msg) {
  this.cmd.message(`<font color="#ccb7ef"> [FPS-UTILS] - </font><font color="#e0d3f5">${msg}</font>`);
}

FpsUtils2.prototype = Object.setPrototypeOf(
  { message, constructor: FpsUtils2 },
  EventEmitter.prototype
);

module.exports = FpsUtils2;
