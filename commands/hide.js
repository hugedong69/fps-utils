"use strict";
const {
  config,
  saveConfig
} = require("../utils");
const { entries: objectEntries } = Object;

function hide(sub, arg) {
  arg = arg.toLowerCase();
  switch (sub.toLowerCase()) {
   case "class":
    if (!config.classNames.has(arg))
      return this.message(`Invalid class "${arg}"`);
    if (config.hiddenClasses.has(arg))
      return this.message(`Class "${arg}" is already hidden`);
    config.hiddenClasses.add(arg);
    for (const [model, classObj] of objectEntries(config.classes)) {
      if (classObj.name !== arg) continue;
      this.emit("hideclass", model);
      this.message(`Class "${arg}" hidden`);
      break;
    }
    break;

   case "role":
    if (!config.roleNames.has(arg))
      return this.message(`Invalid role "${arg}"`);
    if (config.hiddenRoles.has(arg))
      return this.message(`Role "${arg}" is already hidden`);
    config.hiddenRoles.add(arg);
    for (const [model, classObj] of objectEntries(config.classes)) {
      if (!classObj.role.includes(arg)) continue;
      config.hiddenClasses.add(classObj.name);
      this.emit("hideclass", model);
    }
    this.message(`Role "${arg}" hidden`);
    break;

   case "player":
    if (config.blacklistedNames.has(arg))
      return this.message(`Player "${arg}" already hidden`);
    config.blacklistedNames.add(arg);
    this.emit("hideplayer", arg);
    this.message(`Player "${arg}" hidden`);
    break;

   default:
    return this.message(`Unrecognized subcommand "${sub}"`);
  }
  saveConfig();
}

module.exports = hide;