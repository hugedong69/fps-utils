"use strict";

function hidePlayer(name) {
  const { spawnedPlayers, dispatch, hiddenUsers } = this;

  for (const [id, player] of spawnedPlayers) {
    if (player.name !== name) continue;
    dispatch.toClient("S_DESPAWN_USER", 3, {
      gameId: player.gameId,
      type: 1
    });
    hiddenUsers.set(id, player);
    return;
  }
}

function showPlayer(name) {
  const { dispatch, hiddenUsers } = this;

  for (const [id, user] of hiddenUsers) {
    if (user.name !== name) continue;
    dispatch.toClient("S_SPAWN_USER", 13, user);
    hiddenUsers.delete(id);
    return;
  }
}

function hideAll() {
  const { spawnedPlayers, dispatch, hiddenUsers } = this;

  for (const [id, player] of spawnedPlayers) {
    dispatch.toClient("S_DESPAWN_USER", 3, {
      gameId: player.gameId,
      type: 1
    });
    hiddenUsers.set(id, player);
  }
}

function showAll() {
  const { dispatch, hiddenUsers } = this;

  for (const user of hiddenUsers.values()) {
    dispatch.toClient("S_SPAWN_USER", 13, user);
  }
  hiddenUsers.clear();
}

function hideClass(model) {
  const { spawnedPlayers, dispatch, hiddenUsers } = this;

  for (const [id, player] of spawnedPlayers) {
    if (player.templateId % 100 !== model) continue;
    dispatch.toClient("S_DESPAWN_USER", 3, {
      gameId: player.gameId,
      type: 1
    });
    hiddenUsers.set(id, player);
  }
}

function showClass(model) {
  const { dispatch, hiddenUsers } = this;

  for (const [id, user] of hiddenUsers) {
    if (user.templateId % 100 !== model) continue;
    dispatch.toClient("S_SPAWN_USER", 13, user);
    hiddenUsers.delete(id);
  }
}

function updateLoc(event) {
  this.dispatch.toClient("S_USER_LOCATION", 3, {
    gameId: event.gameId,
    loc: event.loc,
    dest: event.loc,
    w: event.w,
    speed: 300,
    type: 7
  });
}

module.exports = that => (
  that
  .on("showall", showAll)
  .on("hideall", hideAll)
  .on("hideclass", hideClass)
  .on("hideplayer", hidePlayer)
  .on("showclass", showClass)
  .on("showplayer", showPlayer)
  .on("updateloc", updateLoc)
);
