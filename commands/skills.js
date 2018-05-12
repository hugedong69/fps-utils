"use strict";
const {
  config,
  saveConfig
} = require("../utils");
const { values: objectValues } = Object;

function skills(arg) {
  arg = arg.toLowerCase();
  switch (arg) {
   case "blacklist":
   case "black":
    this.message(`Hiding of blacklisted skills ${
      (config.blacklistSkills = !config.blacklistSkills) ? "en" : "dis"
    }abled`);
    break;

   case "class":
    if (!config.classNames.has(arg)) return this.message(`Class "${arg}" not found!`);
    for (const classObj of objectValues(config.classes)) {
      if (classObj.name !== arg) continue;
      this.message(`Hidding ALL skills for class "${arg}" ${
        (classObj.blockingSkills = !classObj.blockingSkills) ? "en" : "dis"
      }abled`);
      break;
    }
    break;

   default:
    return this.message(`Unrecognized subcommand "${arg}"`);
  }
  saveConfig();
}

module.exports = skills;