"use strict";
const {
  config,
  saveConfig
} = require("../utils");

function mode(arg) {
  switch (arg) {
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
    return this.message(`Invalid mode ${arg}, valid modes are: 0, 1, 2, 3`);
  }
  saveConfig();
}

module.exports = mode;