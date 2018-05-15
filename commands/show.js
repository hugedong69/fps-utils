"use strict";
const {
  config,
  saveConfig
} = require("../utils");
const { entries: objectEntries } = Object;

function show(sub, arg) {
  arg = arg.toLowerCase();
  switch (sub.toLowerCase()) {
   case "class":
    if (!config.classNames.has(arg))
      return this.message(`Invalid class "${arg}"`);
    if (!config.hiddenClasses.has(arg))
      return this.message(`Class "${arg}" is not hidden`);
    config.hiddenClasses.delete(arg);
    for (const [model, classObj] of objectEntries(config.classes)) {
      if (classObj.name !== arg) continue;
      classObj.isHidden = false;
      this.emit("showclass", model);
      break;
    }
    this.message(`Class "${arg}" shown`);
    break;

   case "role":
    if (!config.roleNames.has(arg))
      return this.message(`Invalid role "${arg}"`);
    if (!config.hiddenRoles.has(arg))
      return this.message(`Role "${arg}" is not hidden`);
    config.hiddenRoles.delete(arg);
    for (const [model, classObj] of objectEntries(config.classes)) {
      if (!classObj.role.includes(arg)) continue;
      config.hiddenClasses.delete(classObj.name);
      classObj.isHidden = false;
      this.emit("showclass", model);
    }
    this.message(`Role "${arg}" shown`);
    break;

   case "player":
    if (!config.blacklistedNames.has(arg))
      return this.message(`Player "${arg}" not hidden`);
    config.blacklistedNames.delete(arg);
    this.emit("showplayer", arg);
    this.message(`Player "${arg}" shown`);
    break;

   default:
    return this.message(`Unrecognized subcommand "${sub}"`);
  }
  saveConfig();
}

module.exports = show;