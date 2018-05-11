"use strict";
const {
  config,
  saveConfig
} = require("./utils");
const { values: objectValues } = Object;

function fpsUtilsCommands(main, sub, arg) {
  main = main == null ? main : main.toLowerCase();

  switch (main) {
   case "mode":
   case "state":
    if (sub) sub = sub.toLowerCase();

    switch (sub) {
     case "0":
     case "off":
      if (config.mode === 3) {
        this.emit("showall");
      }
      config.mode = 0;
      this.message(`All FPS improvements disabled`);
      break;

     case "1":
      if (config.mode === 3) {
        this.emit("showall");
      }
      config.mode = 1;
      // config.hideAllAbnormalities = true;
      config.hitOther = true;
      this.message(`FPS mode set to 1, projectiles hidden and abnormalities disabled`);
      break;

     case "2":
      if (config.mode === 3) {
        this.emit("showall");
      }
      config.mode = 2;
      // config.hideAllAbnormalities = true;
      config.hitOther = true;
      this.message(`FPS mode set to 2, all skill effects disabled`);
      break;

     case "3":
      this.emit("hideall");
      config.mode = 3;
      config.hideAllAbnormalities = true;
      config.hitOther = true;
      this.message(`FPS mode set to 3, hiding all players, their effects and their hit effects`);
      break;

     default:
      return this.message(`Invalid mode ${sub}, valid modes are : 0,1,2,3`);
    }
    break;

   case "hide":
    if (!sub) return this.message(`Invalid name "${sub}"`);
    if (config.blacklistedNames.has(sub)) {
      return this.message(`Player "${sub}" already hidden!`);
    }
    
    else if (
      config.classNames.has(sub) && !config.hiddenClasses.has(sub) ||
      config.roleNames.has(sub) && !config.hiddenRoles.has(sub)
    ) {
      for (const classObj of objectValues(config.classes)) {
        if (
          (classObj.name === sub || classObj.role.includes(sub)) &&
          !classObj.isHidden
        ) continue;
        classObj.isHidden = true;
        if (classObj.name === sub) config.hiddenClasses.add(sub);
        if (classObj.role.includes(sub)) config.hiddenRoles.add(sub);
        this.emit("hideclass", classObj.model);
        break;
      }
      this.message(`Class/Role ${sub} hidden`);
    }

    else if (
      config.hiddenClasses.has(sub) ||
      config.hiddenRoles.has(sub)
    ) {
      return this.message(`Class/Role "${sub}" already hidden!`);
    }

    else {
      this.message(`Player "${sub}" hidden!`);
      config.blacklistedNames.add(sub);
      this.emit("hideplayer", sub);
    }
    break;

   case "show":
    if (!sub) return;
    if (config.blacklistedNames.has(sub)) {
      this.emit("showplayer", sub);
      config.blacklistedNames.delete(sub);
      this.message(`Player "${sub}" shown!`);
      break;
    }

    if (
      config.classNames.has(sub) && config.hiddenClasses.has(sub) ||
      config.hiddenRoles.has(sub) && config.roleNames.has(sub)
    ) {
      for (const classObj of objectValues(config.classes)) {
        if (classObj.name !== sub || !classObj.role.includes(sub)) continue;
        if (classObj.name === sub) config.hiddenClasses.delete(sub);
        if (classObj.role.includes(sub)) config.hiddenRoles.delete(sub);
        classObj.isHidden = false;
        this.emit("showclass", classObj.model);
        this.message(`Class "${sub}" redisplayed!`);
        break;
      }
    }

    else if (
      !config.hiddenClasses.has(sub) ||
      !config.hiddenRoles.has(sub)
    ) {
      return this.message(`Class/Role "${sub}" already displayed!`);
    }

    else if (
      !config.blacklistedNames.has(sub)
    ) {
      return this.message(`Player "${sub}" is not hidden!`);
    }
    break;

   case "list":
    this.message(`Hidden players: ${config.blacklistedNames}`);
    this.message(`Hidden classes: ${config.hiddenClasses}`);
    this.message(`Hidden roles: ${config.hiddenRoles}`);
    break;

   case "summons":
    this.message(`Hiding of summoned NPCs ${
      (config.hideAllSummons = !config.hideAllSummons) ? "en" : "dis"
    }abled`);
    break;

   case "skill":
   case "skills":
    if (sub) sub = sub.toLowerCase();

    switch (sub) {
     case "blacklist":
     case "black":
      this.message(`Hiding of blacklisted skills ${
        (config.blacklistSkills = !config.blacklistSkills) ? "en" : "dis"
      }abled`);
      break;

     case "class":
      if (!config.classNames.has(arg)) return this.message(`Class ${arg} not found!`);
      for (const classObj of objectValues(config.classes)) {
        if (classObj.name !== arg) continue;
        this.message(`Hidding ALL skills for the class ${arg} ${
          (classObj.blockingSkills = !classObj.blockingSkills) ? "en" : "dis"
        }abled`);
        break;
      }
    }
    break;

   case "npc":
   case "npcs":
    this.message(`Hiding of blacklisted NPCs ${
      (config.blacklistNpcs = !config.blacklistNpcs) ? "en" : "dis"
    }abled`);
    break;

   case "hit":
    if (sub) sub = sub.toLowerCase();

    switch (sub) {
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
      return this.message(`Unrecognized sub-command "${sub}"!`);
    }
    break;

   case "firework":
   case "fireworks":
    this.message(`Hiding of firework effects ${
      (config.hideFireworks = !config.hideFireworks) ? "en" : "dis"
    }abled`);
    break;

   case "effects":
   case "Abnormalities":
   case "abnormalities":
   case "fpsbooster9001":
    if (sub) sub = sub.toLowerCase();

    switch (sub) {
     case "all":
      this.message(`Hiding of ALL abnormality effects on players ${
        (config.hideAllAbnormalities = !config.hideAllAbnormalities) ? "en" : "dis"
      }abled`);
      break;

     case "blacklist":
     case "black":
      this.message(`Hiding of blacklisted abnormality effects ${
        (config.blacklistAbnormalities = !config.blacklistAbnormalities) ? "en" : "dis"
      }abled`);
      break;
    }
    break;

   case "style":
   case "costume":
    this.message(`Displaying of all players as wearing default costumes ${
      (config.showStyle = !config.showStyle) ? "en" : "dis"
    }abled, you will have to leave and re-enter the zone for this to take effect`);
    break;

   case "proj":
   case "projectile":
    if (sub) sub = sub.toLowerCase();

    switch (sub) {
     case "all":
      this.message(`Hiding of ALL projectile effects ${
        (config.hideProjectiles = !config.hideProjectiles) ? "en" : "dis"
      }abled`);
      break;
     case "blacklist":
      this.message(`Hiding of BLACKLISTED projectile effects ${
        (config.blacklistProjectiles = !config.blacklistProjectiles) ? "en" : "dis"
      }abled`);
      break;
    }
    break;

   default:
    return this.message("Unknown command! Please refer to the readme for more information");
  }
  saveConfig();
}

module.exports = fpsUtilsCommands;
