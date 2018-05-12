"use strict";
const {
  hit,
  npc,
  list,
  mode,
  show,
  hide,
  style,
  skills,
  effects,
  summons,
  fireworks,
  projectile,
} = require("./fs/");

function fpsUtilsfs(main = "", sub = "", arg = "") {
  let f;
  switch (main.toLowerCase()) {
   case "mode":
   case "state":
    f = mode; break;

   case "hide":
    f = hide; break;

   case "show":
    f = show; break;

   case "list":
    f = list; break;

   case "summons":
    f = summons; break;

   case "skill":
   case "skills":
    f = skills; break;

   case "npc":
   case "npcs":
    f = npc; break;

   case "hit":
    f = hit; break;

   case "firework":
   case "fireworks":
    f = fireworks; break;

   case "effects":
   case "Abnormalities":
   case "abnormalities":
   case "fpsbooster9001":
    f = effects; break;

   case "style":
   case "costume":
    f = style; break;

   case "proj":
   case "projectile":
    f = projectile; break;

   default:
    return this.message("Unknown command! Please refer to the readme for more information");
  }
  f.call(this, sub, arg);
}

module.exports = fpsUtilsfs;
