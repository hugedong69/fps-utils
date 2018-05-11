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
  blacklistedNames: {
    type: "Set",
    data: [
      "hugedong",
    ]
  },
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
  classNames: {
    type: "Set",
    data: ["warrior", "lancer", "slayer", "berserker", "sorcerer", "archer", "priest", "mystic", "reaper", "gunner", "brawler", "ninja", "valkyrie"]
  },
  roleNames: {
    type: "Set",
    data: ["dps", "healer", "tank", "ranged"]
  },
  hiddenClasses: {
    type: "Set",
    data: []
  },
  hiddenRoles: {
    type: "Set",
    data: []
  },
  classes: {
    1: {
      name: "warrior",
      model: 1,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    2: {
      name: "lancer",
      model: 2,
      blockedSkills: [],
      blockingSkills: false,
      role: ["tank"],
      isHidden: false
    },
    3: {
      name: "slayer",
      model: 3,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    4: {
      name: "berserker",
      model: 4,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    5: {
      name: "sorcerer",
      model: 5,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    6: {
      name: "archer",
      model: 6,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    7: {
      name: "priest",
      model: 7,
      blockedSkills: [],
      blockingSkills: false,
      role: ["healer"],
      isHidden: false
    },
    8: {
      name: "mystic",
      model: 8,
      blockedSkills: [],
      blockingSkills: false,
      role: ["healer"],
      isHidden: false
    },
    9: {
      name: "reaper",
      model: 9,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    10: {
      name: "gunner",
      model: 10,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps", "ranged"],
      isHidden: false
    },
    11: {
      name: "brawler",
      model: 11,
      blockedSkills: [],
      blockingSkills: false,
      role: ["tank"],
      isHidden: false
    },
    12: {
      name: "ninja",
      model: 12,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
    13: {
      name: "valkyrie",
      model: 13,
      blockedSkills: [],
      blockingSkills: false,
      role: ["dps"],
      isHidden: false
    },
  }
};