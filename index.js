/* global __dirname */

const path = require('path');
const Command = require('command');
const fs = require('fs');


module.exports = function FpsUtils2(dispatch) {
    let firstRun = false,
        myId,
        config,
        spawnedPlayers = {},
        hiddenUsers = {},
        hiddenNpcs = {};
    const command = Command(dispatch);
    try { //generate config
        config = require('./config.json');
    } catch (e) {
        log("CONFIG FILE NOT FOUND, GENERATING ONE NOW");
        firstRun = true;
        config = {
            "version": "1.011",
            "mode": "0",
            "hideFireworks": false,
            "hideAllAbnormies": false,
            "hideAllSummons": false,
            "blacklistNpcs": false,
            "blacklistSkills": false,
            "blacklistAbnormies": false,
            "hideProjectiles": false,
            "hiddenAbnormies": [],
            "blacklistProjectiles": false,
            "hiddenProjectiles": [67379784],
            "hitMe": false,
            "hitOther": false,
            "hitDamage": false,
            "showStyle": false,
            "blacklistedNames": [
                "hugedong"
            ],
            "hiddenNpcs": [
                {
                    "zone": 1,
                    "templateId": 1
                },
                {
                    "zone": 1,
                    "tempalteId": 2
                }
            ],
            "classNames": ["warrior", "lancer", "slayer", "berserker", "sorcerer", "archer", "priest", "mystic", "reaper", "gunner", "brawler", "ninja", "valkyrie"],
            "roleNames": ["dps", "healer", "tank", "ranged"],
            "hiddenClasses": [],
            "hiddenRoles": [],
            "classes": {
                "1": {
                    "name": "warrior",
                    "model": 1,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                },
                "2": {
                    "name": "lancer",
                    "model": 2,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["tank"],
                    "isHidden": false
                },
                "3": {
                    "name": "slayer",
                    "model": 3,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                },
                "4": {
                    "name": "berserker",
                    "model": 4,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                },
                "5": {
                    "name": "sorcerer",
                    "model": 5,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps", "ranged"],
                    "isHidden": false
                },
                "6": {
                    "name": "archer",
                    "model": 6,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps", "ranged"],
                    "isHidden": false
                },
                "7": {
                    "name": "priest",
                    "model": 7,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["healer"],
                    "isHidden": false
                },
                "8": {
                    "name": "mystic",
                    "model": 8,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["healer"],
                    "isHidden": false
                },
                "9": {
                    "name": "reaper",
                    "model": 9,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                },
                "10": {
                    "name": "gunner",
                    "model": 10,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps", "ranged"],
                    "isHidden": false
                },
                "11": {
                    "name": "brawler",
                    "model": 11,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["tank"],
                    "isHidden": false
                },
                "12": {
                    "name": "ninja",
                    "model": 12,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                },
                "13": {
                    "name": "valkyrie",
                    "model": 13,
                    "blockedSkills": [],
                    "blockingSkills": false,
                    "role": ["dps"],
                    "isHidden": false
                }
            }
        };
        saveConfig();
    }

    // ~~~ * Commands * ~~~

    command.add('fps', (cmd, arg, arg2) => {
        //easier than replacing everything else
        switch (cmd) {
            case "mode":
            case "state":
                switch (arg) {
                    case "0":
                    case "off":
                        if (config.mode === 3) {
                            showAll();
                        }
                        config.mode = 0;
                        message(`All FPS improvements disabled`);
                        break
                    case "1":
                        if (config.mode === 3) {
                            showAll();
                        }
                        config.mode = 1;
                        //config.hideAllAbnormies = true;
                        config.hitOther = true;
                        message(`FPS mode set to 1, projectiles hidden and abnormalities disabled`);
                        break
                    case "2":
                        if (config.mode === 3) {
                            showAll();
                        }
                        config.mode = 2;
                        // config.hideAllAbnormies = true;
                        config.hitOther = true;
                        message(`FPS mode set to 2, all skill effects disabled`);
                        break
                    case "3":
                        hideAll();
                        config.mode = 3;
                        config.hideAllAbnormies = true;
                        config.hitOther = true;
                        message(`FPS mode set to 3, hiding all players, their effects and their hit effects.`);
                        break
                    default:
                        message(`Invalid mode ${arg}, valid modes are : 0,1,2,3`);
                }
                break
            case "hide":
                if (typeof arg === "string" && arg !== null) {
                    if (config.blacklistedNames.includes(arg)) {
                        message(`Player "${arg}" already hidden!`);
                        return;
                    } else
                        if ((config.classNames.includes(arg) && !config.hiddenClasses.includes(arg)) || (config.roleNames.includes(arg) && !config.hiddenRoles.includes(arg))) {
                            for (let i in config.classes) {
                                if ((config.classes[i].name === arg || config.classes[i].role.includes(arg)) && config.classes[i].isHidden !== true) { //loops are fun, right?
                                    config.classes[i].isHidden = true;
                                    if (config.classes[i].name === arg) {
                                        config.hiddenClasses.push(arg);
                                    }
                                    if (config.classes[i].role.includes(arg)) {
                                        config.hiddenRoles.push(arg);
                                    }
                                    let classtohide = config.classes[i].model;
                                    for (let i in spawnedPlayers) {
                                        if (getClass(spawnedPlayers[i].templateId) === classtohide) {
                                            hidePlayer(spawnedPlayers[i].name);
                                        }
                                    }
                                }
                            }
                            saveConfig();
                            message(`Class/Role ${arg} hidden`);
                            return;
                        } else if (config.hiddenClasses.includes(arg) || config.hiddenRoles.includes(arg)) {
                            message(`Class/Role "${arg}" already hidden!`);
                            return;
                        }
                    // if (!spawnedPlayers[arg]) {
                    //   message(`Player ${arg} not spawned in, hiding anyway!`);
                    // } else {
                    message(`Player "${arg}" hidden!`);
                    // }
                    config.blacklistedNames.push(arg);
                    hidePlayer(arg);
                    return;
                } else
                    message(`Invalid name "${arg}"`);
                break
            case "show":
                if (typeof arg === "string" && arg !== null) {
                    if (config.blacklistedNames.includes(arg)) {
                        showPlayer(arg);
                        removeName(config.blacklistedNames, arg);
                        message(`Player "${arg}" shown!`);
                        saveConfig();
                        return;
                    }
                    if ((config.classNames.includes(arg) && config.hiddenClasses.includes(arg)) || (config.hiddenRoles.includes(arg) && config.roleNames.includes(arg))) {
                        for (let i in config.classes) {
                            if (config.classes[i].name === arg || config.classes[i].role.includes(arg)) {//loops are fun, right?
                                if (config.classes[i].name === arg) {
                                    removeName(config.hiddenClasses, arg);
                                }
                                if (config.classes[i].role.includes(arg)) {
                                    removeName(config.hiddenRoles, arg);
                                }
                                config.classes[i].isHidden = false;
                                let classToShow = config.classes[i].model;
                                for (let i in hiddenUsers) {
                                    if (getClass(hiddenUsers[i].templateId) === classToShow) {
                                        showPlayer(hiddenUsers[i].name);
                                    }
                                }

                            }
                        }
                        message(`Class "${arg}" redisplayed!`);
                        saveConfig();
                        return;
                    } else if (!config.hiddenClasses.includes(arg) || !config.hiddenRoles.includes(arg)) {
                        message(`Class/Role "${arg}" already displayed!!`);
                        return;
                    } else
                        if (!config.blacklistedNames.includes(arg)) {
                            message(`Player "${arg}" is not hidden!`);
                            return;
                        }
                }
                break
            case "list":
                message(`Hidden players: ${config.blacklistedNames}`);
                message(`Hidden classes: ${config.hiddenClasses}`);
                message(`Hidden roles: ${config.hiddenRoles}`);
                break
            case "summons":
                config.hideAllSummons = !config.hideAllSummons;
                message(`Hiding of summoned NPCs ${config.hideAllSummons ? 'en' : 'dis'}abled`);
                break
            case "skills":
            case "skill":
                switch (arg) {
                    case "blacklist":
                    case "black":
                        config.blacklistSkills = !config.blacklistSkills;
                        message(`Hiding of blacklisted skills ${config.blacklistSkills ? 'en' : 'dis'}abled`);
                        break
                    case "class":
                        if (config.classNames.includes(arg2)) {
                            for (let i in config.classes) {
                                if (config.classes[i].name === arg2) {
                                    config.classes[i].blockingSkills = !config.classes[i].blockingSkills;
                                    message(`Hidding ALL skills  for the class ${arg2} ${config.classes[i].blockingSkills ? 'en' : 'dis'}abled`);
                                    saveConfig();
                                    return;
                                }
                            }

                        } else
                            message(`Class ${arg2} not found!`);
                        break
                }
                break
            case "npcs":
            case "npc":
                config.blacklistNpcs = !config.blacklistNpcs;
                message(`Hiding of blacklisted NPCs ${config.blacklistNpcs ? 'en' : 'dis'}abled`);
                break
            case "hit":
                switch (arg) {
                    case "me":
                        config.hitMe = !config.hitMe;
                        message(`Hiding of the players skill hits ${config.hitMe ? 'en' : 'dis'}abled`);
                        break
                    case "other":
                        config.hitOther = !config.hitOther;
                        message(`Hiding of other players skill hits ${config.hitOther ? 'en' : 'dis'}abled`);
                        break
                    case "damage":
                        config.hitDamage = !config.hitDamage;
                        message(`Hiding of the players skill damage numbers ${config.hitDamage ? 'en' : 'dis'}abled`);
                        break
                    default:
                        message(`Unrecognized sub-command "${arg}"!`);
                        break
                }
                break
            case "fireworks":
            case "firework":
                config.hideFireworks = !config.hideFireworks;
                message(`Hiding of firework effects ${config.hideFireworks ? 'en' : 'dis'}abled`);
                break
            case "fpsbooster9001":
            case "effects":
            case "abnormies":
                switch (arg) {
                    case "all":
                        config.hideAllAbnormies = !config.hideAllAbnormies;
                        message(`Hiding of ALL abnormality effects on players ${config.hideAllAbnormies ? 'en' : 'dis'}abled`);
                        break
                    case "blacklist":
                    case "black":
                        config.blacklistAbnormies = !config.blacklistAbnormies;
                        message(`Hiding of blacklisted abnormality effects ${config.blacklistAbnormies ? 'en' : 'dis'}abled`);
                        break
                }
                break
            case "costume":
            case "style":
                config.showStyle = !config.showStyle;
                message(`Displaying of all players as wearing default costumes ${config.showStyle ? 'en' : 'dis'}abled, you will have to leave and re-enter the zone for this to take effect`);
                break
            case "proj":
            case "projectile":
                switch (arg) {
                    case "all":
                        config.hideProjectiles = !config.hideProjectiles;
                        message(`Hiding of ALL projectile effects ${config.hideProjectiles ? 'en' : 'dis'}abled`);
                        break
                    case "blacklist":
                        config.blacklistProjectiles = !config.blacklistProjectiles;
                        message(`Hiding of ALL projectile effects ${config.blacklistProjectiles ? 'en' : 'dis'}abled`);
                        break
                }
                break
            default:
                message(`Unknown command! Please refer to the readme for more information`);
                break
        }
        saveConfig();
    });
    // ~~~ * Functions * ~~~
    function message(msg) {
        command.message(`<font color="#ccb7ef">  [FPS-UTILS] - </font> <font color="#e0d3f5">${msg}`);
    }

    function getClass(m) {
        return (m % 100);
    }

    function saveConfig() {
        fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(
            config, null, 4), err => {
            });
    }

    function hidePlayer(name) {
        for (let i in spawnedPlayers) {
            if (spawnedPlayers[i].name.toString().toLowerCase() === name.toLowerCase()) {
                dispatch.toClient('S_DESPAWN_USER', 3, {
                    gameId: spawnedPlayers[i].gameId,
                    type: 1
                });
                hiddenUsers[spawnedPlayers[i].gameId] = spawnedPlayers[i];
                return;
            }
        }
    }

    function removeName(name) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && name.length) {
            what = a[--L];
            while ((ax = name.indexOf(what)) !== -1) {
                name.splice(ax, 1);
            }
        }
        return name;
    }

    function showPlayer(name) {
        for (let i in hiddenUsers) {
            if (hiddenUsers[i].name.toString().toLowerCase() === name.toLowerCase()) {
                dispatch.toClient('S_SPAWN_USER', 13, hiddenUsers[i]);
                delete hiddenUsers[i];
                return;
            }
        }
    }

    function hideAll() {
        for (let i in spawnedPlayers) {
            dispatch.toClient('S_DESPAWN_USER', 3, {
                gameId: spawnedPlayers[i].gameId,
                type: 1
            });
            hiddenUsers[spawnedPlayers[i].gameId] = spawnedPlayers[i];
        }
    }

    function showAll() {
        for (let i in hiddenUsers) {
            dispatch.toClient('S_SPAWN_USER', 13, hiddenUsers[i]);
            delete hiddenUsers[i];
        }
    }

    function updateLoc(event) {
        dispatch.toClient('S_USER_LOCATION', 3, {
            gameId: event.gameId,
            loc: event.loc,
            dest: event.loc,
            w: event.w,
            speed: 300,
            type: 7
        });
    }

    function log(msg) {
        console.log(`[FPS-UTILS] - ${msg}`);
    }

    // ~~~* Hooks * ~~~
    // note: for skills, do if classes[event.templateId].blockedSkills !==

    dispatch.hook('S_LOGIN', 10, (event) => {
        myId = event.gameId;
    });

    dispatch.hook('S_SPAWN_USER', 13, { order: 9999 }, (event) => {
        if (firstRun !== false) {
            message(`FPS-UTILS has been updated! Please read the readme for more information!`);
            firstRun = false;
        }
        spawnedPlayers[event.gameId] = event;
        if (config.mode === 3 || config.blacklistedNames.includes(event.name.toString().toLowerCase()) || config.classes[getClass(event.templateId)].isHidden === true) { //includes should work!!
            hiddenUsers[event.gameId] = event;
            return false;
        }
        if (config.showStyle) {
            event.weaponEnchant = 0;
            event.body = 0;
            event.hand = 0;
            event.feet = 0;
            event.underwear = 0;
            event.head = 0;
            event.face = 0;
            event.weapon = 0;
            event.showStyle = false;
            return true;
        }
    });

    dispatch.hook('S_USER_EXTERNAL_CHANGE', 6, { order: 9999 }, (event) => {
        if (config.showStyle && !event.gameId.equals(myId)) {
            event.weaponEnchant = 0;
            event.body = 0;
            event.hand = 0;
            event.feet = 0;
            event.underwear = 0;
            event.head = 0;
            event.face = 0;
            event.weapon = 0;
            event.showStyle = false;
            return true;
        }
    });

    dispatch.hook('S_SPAWN_USER', 13, { order: 99999, filter: { fake: null } }, (event) => {
        if (config.showStyle) {
            event.weaponEnchant = 0;
            event.body = 0;
            event.hand = 0;
            event.feet = 0;
            event.underwear = 0;
            event.head = 0;
            event.face = 0;
            event.weapon = 0;
            event.showStyle = false;
            return true;
        }
    });

    dispatch.hook('S_DESPAWN_USER', 3, { order: 999 }, (event) => {
        delete hiddenUsers[event.gameId];
        delete spawnedPlayers[event.gameId];
    });

    dispatch.hook('S_LOAD_TOPO', 'raw', () => {
        spawnedPlayers = {};
        hiddenUsers = {};
        hiddenNpcs = {};
    });

    dispatch.hook('S_SPAWN_NPC', 8, (event) => {
        if (config.hideAllSummons && event.huntingZoneId === 1023) {
            hiddenNpcs[event.gameId] = event; // apparently NPCs get feared and crash the client too
            return false;
        }
        if (config.blacklistNpcs) {
            for (var i = 0; i < config.hiddenNpcs.length; i++) {
                if (event.huntingZoneId === config.hiddenNpcs[i].zone && event.templateId === config.hiddenNpcs[i].templateId) {
                    hiddenNpcs[event.gameId] = event;
                    return false;
                }
            }
        }
        if (config.hideFireworks && event.huntingZoneId === 1023 && (event.templateId === 60016000 || event.templateId === 80037000)) {
            return false;
        }
    });

    dispatch.hook('S_DESPAWN_NPC', 3, (event) => {
        delete hiddenNpcs[event.gameId];
    });

    dispatch.hook('S_EACH_SKILL_RESULT', dispatch.base.majorPatchVersion < 74 ? 10 : 12, { order: 200 }, (event) => {
        if (event.source.equals(myId) || event.owner.equals(myId)) {
            if (config.hitMe) {
                event.skill.id = '';
                return true;
            }
            if (config.hitDamage) {
                event.damage = '';
                return true;
            }
        }
        if (config.hitOther && (spawnedPlayers[event.owner] || spawnedPlayers[event.source]) && !event.target.equals(myId)) {
            event.skill.id = '';
            return true;
        }
    });

    dispatch.hook('S_USER_LOCATION', 3, (event) => {
        if (hiddenUsers[event.gameId] === undefined) {
            return;
        }
        hiddenUsers[event.gameId].loc = event.dest;
        if (hiddenUsers[event.gameId]) {
            return false;
        }
    });



    dispatch.hook('S_ACTION_STAGE', 4, { order: 999 }, (event) => {
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId]) {
            if (!event.target.equals(myId) && (config.mode === 2 || hiddenUsers[event.gameId])) {
                updateLoc(event);
                return false;
            }
            if (config.blacklistSkills) {
                if (typeof config.classes[getClass(event.templateId)].blockedSkills !== "undefined" && config.classes[getClass(event.templateId)].blockedSkills.includes(Math.floor((event.skill - 0x4000000) / 10000))) {
                    updateLoc(event);
                    return false;
                }
            }
            if (config.classes[getClass(event.templateId)].blockingSkills) {
                updateLoc(event);
                return false;
            }
        }
    });

    dispatch.hook('S_START_USER_PROJECTILE', 5, { order: 999 }, (event) => {
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId] && (hiddenUsers[event.gameId] || config.mode > 0 || config.hideProjectiles)) {
            return false;
        }
        if (config.blacklistProjectiles && config.hiddenProjectiles.includes(event.skill)) {
            return false;
        }
    });

    dispatch.hook('S_SPAWN_PROJECTILE', 3, { order: 999 }, (event) => {
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId] && (hiddenUsers[event.gameId] || config.mode > 0 || config.hideProjectiles)) {
            return false;
        }
        if (config.blacklistProjectiles && config.hiddenProjectiles.includes(event.skill)) {
            return false;
        }
    });

    dispatch.hook('S_FEARMOVE_STAGE', 1, (event) => {
        if ((!event.target.equals(myId) && config.mode === 3) || hiddenUsers[event.target] || hiddenNpcs[event.target]) {
            return false;
        }
    });
    dispatch.hook('S_FEARMOVE_END', 1, (event) => {
        if ((!event.target.equals(myId) && config.mode === 3) || hiddenUsers[event.target] || hiddenNpcs[event.target]) {
            return false;
        }
    });

    dispatch.hook('S_USER_MOVETYPE', 'raw', () => { //this little boi crashes us, raw due to def missing from caali
        return false;
    });

    dispatch.hook('S_ABNORMALITY_REFRESH', 1, (event) => {
        if (hiddenUsers[event.target]) {
            return false;
        }
    });

    dispatch.hook('S_ABNORMALITY_BEGIN', 2, { order: 999 }, (event) => {
        if (hiddenUsers[event.target]) {
            return false;
        }
        if (config.blacklistAbnormies && config.hiddenAbnormies.includes(event.id)) {
            return false;
        }
        if (config.hideAllAbnormies && !event.target.equals(myId) && (spawnedPlayers[event.target] && spawnedPlayers[event.source])) {
            return false;
        }
    });

};
