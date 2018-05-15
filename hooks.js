"use strict";
const { config, longAsString } = require("./utils");
const { ZERO } = require("long");
const dataMap = new WeakMap;

const block = () => false;

function onLogin({ gameId }) {
  dataMap.get(this).myId = gameId;
}

function checkStyle(event) {
  if (!config.showStyle) return;
  event.weaponEnchant =
  event.body =
  event.hand =
  event.feet =
  event.underwear =
  event.head =
  event.face =
  event.weapon = 0;
  event.showStyle = false;
  return true;
}

function onSpawnUser(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.gameId);
  self.spawnedPlayers.set(id, event);

  if (
    config.mode === 3 ||
    config.blacklistedNames.has(event.name.toLowerCase()) ||
    config.classes[event.templateId % 100].isHidden
  ) {
    self.hiddenUsers.set(id, event);
    return false;
  }
}

function onDespawnUser(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.gameId);

  self.hiddenUsers.delete(id);
  self.spawnedPlayers.delete(id);
}

function clearMaps() {
  const self = dataMap.get(this);

  self.hiddenNpcs.clear();
  self.hiddenUsers.clear();
  self.spawnedPlayers.clear();
}

function onSpawnNpc(event) {
  const self = dataMap.get(this);

  if (
    config.hideAllSummons &&
    event.huntingZoneId === 1023
  ) {
    // NPCs can get feared and crash the client
    self.hiddenNpcs.set(longAsString(event.gameId), event);
    return false;
  }

  if (config.blacklistNpcs) {
    for (const npc of config.hiddenNpcs) {
      if (
        event.huntingZoneId === npc.zone &&
        event.templateId === npc.templateId
      ) {
        self.hiddenNpcs.set(longAsString(event.gameId), event);
        return false;
      }
    }
  }

  if (
    config.fireworks &&
    event.huntingZoneId === 1023
  ) {
    switch (event.templateId) {
     case 60016000:
     case 80037000:
      return false;
    }
  }
}

function onDespawnNpc(event) {
  dataMap.get(this).hiddenNpcs.delete(longAsString(event.gameId));
}

function onSkillResult(event) {
  const self = dataMap.get(this);

  if (
    event.source.equals(self.myId) ||
    event.owner.equals(self.myId)
  ) {
    if (config.hitMe) {
      event.skill = 0;
      return true;
    }
    if (config.hitDamage) {
      event.damage = ZERO;
      return true;
    }
  }

  if (
    config.hitOther &&
    (
      self.spawnedPlayers.has(longAsString(event.owner)) ||
      self.spawnedPlayers.has(longAsString(event.source))
    ) &&
    !event.target.equals(self.myId)
  ) {
    event.skill = 0;
    return true;
  }
}

function onUserLocation(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.gameId);

  if (!self.hiddenUsers.has(id)) return;

  self.hiddenUsers.get(id).loc = event.dest;
  return false;
}

function onActionStage(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.gameId);

  if (
    !event.gameId.equals(self.myId) &&
    self.spawnedPlayers.has(id)
  ) {
    if (
      !event.target.equals(self.myId) &&
      (
        config.mode === 2 ||
        self.hiddenUsers.has(id)
      )
    ) {
      self.emit("updateloc", event);
      return false;
    }

    const _class = config.classes[event.templateId % 100];
    if (config.blacklistSkills) {
      if (
        _class.blockedSkills.includes(
          (event.skill - 0x4000000) / 10000 | 0
        )
      ) {
        self.emit("updateloc", event);
        return false;
      }
    }

    if (_class.blockingSkills) {
      self.emit("updateloc", event);
      return false;
    }
  }
}

function onProjectile(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.gameId);

  if (
    !event.gameId.equals(self.myId) &&
    self.spawnedPlayers.has(id) &&
    (
      self.hiddenUsers.has(id) ||
      config.mode > 0 ||
      config.hideProjectiles
    )
  ) {
    return false;
  }

  if (
    config.blacklistProjectiles &&
    config.hiddenProjectiles.includes(event.skill)
  ) {
    return false;
  }
}

function onFear(event) {
  const self = dataMap.get(this);

  if (
    !event.target.equals(self.myId) &&
    config.mode === 3
  ) {
    return false;
  }

  const id = longAsString(event.target);
  if (
    self.hiddenUsers.has(id) ||
    self.hiddenNpcs.has(id)
  ) {
    return false;
  }
}

function onAbnormalityRefresh(event) {
  if (dataMap.get(this).hiddenUsers.has(longAsString(event.target))) {
    return false;
  }
}

function onAbnormalityBegin(event) {
  const self = dataMap.get(this);
  const id = longAsString(event.target);

  if (self.hiddenUsers.has(id)) {
    return false;
  }

  if (
    config.blacklistAbnormalities &&
    config.hiddenAbnormalities.includes(event.id)
  ) {
    return false;
  }

  if (
    config.hideAllAbnormalities && 
    event.target.equals(self.myId) &&
    self.spawnedPlayers.has(id) &&
    self.spawnedPlayers.has(longAsString(event.source))
  ) {
    return false;
  }
}

function addHooks(that) {
  const hook = (...args) => {
    const hookObj = that.dispatch.hook(...args);
    dataMap.set(hookObj, that);
    return hookObj;
  };

  hook("S_LOGIN", 10, onLogin);
  hook("S_SPAWN_USER", 13, { order: 1e4 }, onSpawnUser);
  hook("S_USER_EXTERNAL_CHANGE", 6, { order: 1e4 }, checkStyle);
  hook("S_SPAWN_USER", 13, { order: 1e5, filter: { fake: null } }, checkStyle);
  hook("S_DESPAWN_USER", 3, { order: 1e3 }, onDespawnUser);
  hook("S_LOAD_TOPO", "raw", clearMaps);
  hook("S_SPAWN_NPC", 6, onSpawnNpc);
  hook("S_DESPAWN_NPC", 3, onDespawnNpc);
  hook("S_EACH_SKILL_RESULT", 6, onSkillResult);
  hook("S_USER_LOCATION", 3, onUserLocation);
  hook("S_ACTION_STAGE", 4, { order: 1e3 }, onActionStage);
  hook("S_START_USER_PROJECTILE", 5, { order: 1e3 }, onProjectile);
  hook("S_SPAWN_PROJECTILE", 3, { order: 1e3 }, onProjectile);
  hook("S_FEARMOVE_STAGE", 1, onFear);
  hook("S_FEARMOVE_END", 1, onFear);
  hook("S_USER_MOVETYPE", "raw", block);
  hook("S_ABNORMALITY_REFRESH", 1, onAbnormalityRefresh);
  hook("S_ABNORMALITY_BEGIN", 2, { order: 1e3 }, onAbnormalityBegin);
}

module.exports = addHooks;
