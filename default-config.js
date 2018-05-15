"use strict";

module.exports = {
  version: 0, // incremental, not semver
  mode: 0,
  hideFireworks: false,
  hideAllAbnormalities: false,
  hideAllSummons: false,
  blacklistNpcs: false,
  blacklistSkills: false,
  blacklistAbnormalities: false,
  hideProjectiles: false,
  hiddenAbnormalities: [],
  blacklistProjectiles: false,
  hiddenProjectiles: [67379784],
  hitMe: false,
  hitOther: false,
  hitDamage: false,
  showStyle: false,
  blacklistedNames: new Set([
    "hugedong",
  ]),
  hiddenNpcs: [
    {
      zone: 1,
      templateId: 1
    },
    {
      zone: 1,
      tempalteId: 2
    },
  ],
  classNames:  new Set(["warrior", "lancer", "slayer", "berserker", "sorcerer", "archer", "priest", "mystic", "reaper", "gunner", "brawler", "ninja", "valkyrie"]),
  roleNames:  new Set(["dps", "healer", "tank", "ranged"]),
  hiddenClasses:  new Set,
  hiddenRoles:  new Set,
  classes: {
    1: {
      name: "warrior",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    2: {
      name: "lancer",
      blockedSkills: [],
      blockingSkills: false,
      role: ["tank"],
      isHidden: false
    },
    3: {
      name: "slayer",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    4: {
      name: "berserker",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    5: {
      name: "sorcerer",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    6: {
      name: "archer",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    7: {
      name: "priest",
      blockedSkills: [],
      blockingSkills: false,
      role: ["healer"],
      isHidden: false
    },
    8: {
      name: "mystic",
      blockedSkills: [],
      blockingSkills: false,
      role: ["healer"],
      isHidden: false
    },
    9: {
      name: "reaper",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    10: {
      name: "gunner",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    11: {
      name: "brawler",
      blockedSkills: [],
      blockingSkills: false,
      role: ["tank"],
      isHidden: false
    },
    12: {
      name: "ninja",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    13: {
      name: "valkyrie",
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
  }
};