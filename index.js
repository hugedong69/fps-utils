/* global __dirname */
let BadGui

try {
    BadGui = require('badGui')
} catch (e) {
    try {
        BadGui = require('badGui-master')
    } catch (e) {
        console.log(`[FPS-UTILS] - badGUI not installed, GUI functionality disabled, please see the readme for more information`)
    }
}

module.exports = function FpsUtils2(mod) {
    const npcData = require(`./npcData.json`)
    const skills = require(`./skillString.json`)
    let data = [],
        gui,
        useGui = false,
        red = `#e3d6d9`,
        green = `#204ed3`,
        myId,
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        partyMembers = [],
        spawnedPlayers = {},
        hiddenUsers = {},
        hiddenNpcs = {};
    try {
        gui = new BadGui(mod);
        useGui = true
    } catch (e) {
        useGui = false
        console.log(`[FPS-UTILS] - badGUI not installed, GUI functionality disabled, please see the readme for more information`)
    }
    // ~~~ * GUI handling stuff I should put somewhere else * ~~~

    function listSkills(value) {
        let keys = []
        let data = []
        let skillIds = []
        data.push(
            { text: `<font color="#4dd0e1" size="+18">Select the skills that you wish to hide</font><br>` },
            { text: `Click here to return to the main menu<br><font size="+17">`, command: `fps gui` }
        )
        for (let key in skills[value]) {
            keys.push(key);
        }
        skillIds.push(Object.values(skills[value]))
        for (var i = 0; i < keys.length; i++) {
            data.push({ command: `fps skill class ${value} ${skillIds[0][i]};fps gui class ${value}`, text: `<font color="${mod.settings.classes[classId(value)].blockedSkills.includes(skillIds[0][i].toString()) ? green : red}"> [${keys[i]}]</font><br>` })
            //this is by far the worse and best thing I have ever seen
        }
        return data
    }

    function search(nameKey, array, arg) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].Name.startsWith(nameKey) && arg == `starts`) {
                data.push({
                    command: `fps npc hide ${array[i].HuntingZoneId} ${array[i].TemplateId};fps gui npc ${nameKey}`, text: `<font color="${mod.settings.hiddenNpcs.some(() => {
                        return mod.settings.hiddenNpcs.some((arrVal) => {
                            if (array[i].HuntingZoneId == arrVal.zone && array[i].TemplateId == arrVal.templateId) {
                                return true
                            } else
                                return false
                        })
                    }) ? green : red}"> [${array[i].Name}]</font><br>`
                })
            }
            if (array[i].Name.includes(nameKey) && arg == `search`) {
                data.push({ command: `fps npc hide ${array[i].HuntingZoneId} ${array[i].TemplateId};fps gui npc ${nameKey}`, text: ` [${array[i].Name}]<br>` })
            }
            if (!isNaN(arg)) {//ho boy wow what are you dooooing
                if (array[i].nameKey == arg) {
                    return true
                }
            }
        }
        gui.parse(data, `<font color="#dcc856"> FPS-UTILS Options - NPCs`)
        data = []
    }

    function classId(name) { //this should really be reused for things other than GUI but can't be without adding their bloat here or changing the structure of the commands
        for (let ass of Object.keys(mod.settings.classes)) {
            if (mod.settings.classes[ass].name == name) {
                return ass
            }
        }
    }


    function handleGui(page, arg) {
        switch (page) {
            case 'searchnpc':
            case 'npcsearch':
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Search results for "${arg}":<br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` }
                )
                search(arg, npcData, `search`)
                break
            case 'npc':
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Search results for "${arg}":<br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` }
                )
                search(arg, npcData, `starts`)
                break
            case 'npclist':
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Select an NPC ID to remove it from the blacklist:<br><font size="+18">` },
                    { text: `Click here to return to the main menu<br>`, command: `fps gui` },
                    { text: `Click here to return to the main NPC page<br><font size="+18">`, command: `fps gui npcMain` },
                )
                for (let i = 0; i < mod.settings.hiddenNpcs.length; i++) {
                    data.push({ text: `${mod.settings.hiddenNpcs[i].zone}, ${mod.settings.hiddenNpcs[i].templateId}<br>`, command: `fps npc hide ${mod.settings.hiddenNpcs[i].zone} ${mod.settings.hiddenNpcs[i].templateId};fps gui npclist` })
                }
                gui.parse(data, `<font color="#dcc856"> FPS-UTILS Options - NPCs`)
                break
            case 'npcMain':
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Click here to return to the main menu<br><font size="+18">`, command: `fps gui` },
                    { text: `Click here to list currently hidden NPCs by Zone/TemplateId<br>`, command: `fps gui npclist` },
                    { text: `<font color="${mod.settings.blacklistNpcs ? green : red}">[Toggle hiding of blacklisted NPCs]</font><br></br>`, command: `fps npc;fps gui npcMain` },
                    { text: `<font color="#4dd0e1" size="+22">Select a letter to view all NPCs starting with that letter:<br>` },
                    { text: `<font color="#dcc856" size="+16">You can also use the command "fps gui searchnpc [name]" to search for a specific NPC by name</font><br><br>` },

                )
                for (var i = 0; i < alphabet.length; i++) {
                    data.push({ text: `${alphabet[i]} `, command: `fps gui npc ${alphabet[i]}` })
                }
                gui.parse(data, `<font color="#dcc856"> FPS-UTILS Options - NPCs`)
                break
            case "hide":
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Select a player to hide them and add them to the blacklist<br>` },
                    { text: `<font color="#4dd0e1" size="+18">You can also use the command "fps hide <playername>" to hide someone that does not appear here<br><br>` },
                    { text: `Click here to return to the main menu<br><font size="+17">`, command: `fps gui` }
                )
                for (let i in spawnedPlayers) {
                    data.push({ text: `<font color="${mod.settings.blacklistedNames.includes(spawnedPlayers[i].name) ? green : red}">${spawnedPlayers[i].name}</font><br>`, command: `fps hide ${spawnedPlayers[i].name};fps gui hide` })
                }
                gui.parse(data, `<font color="#dcc856"> FPS-UTILS Options - Players`)
                break
            case "show":
                data = []
                data.push(
                    { text: `<font color="#4dd0e1" size="+22">Select a player to unhide them and remove them from the blacklist<br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` }
                )
                mod.settings.blacklistedNames.forEach((mem) => { data.push({ text: `${mem}<br>`, command: `fps show ${mem};fps gui show` }) }) //yes this is not the best
                gui.parse(data, `<font color="#dcc856"> FPS-UTILS Options - Hidden Users`)
                break
            case "skills":
                gui.parse([
                    { text: `<font color="#4dd0e1" size="+22">Hide skills by class:<br><br>` },
                    { text: `Click here to return to the main menu<br>`, command: `fps gui` },
                    { text: `<font color="${mod.settings.blacklistSkills ? green : red}">[toggle skill blacklisting]</font><br>`, command: `fps skill black` },
                    { text: `Hide Specific Skills (Click a class name to open up a list of its skills):<font size="+17"><br>` },
                    { text: `Warrior<br>`, command: `fps gui class warrior` },
                    { text: `Lancer<br>`, command: `fps gui class lancer` },
                    { text: `Slayer<br>`, command: `fps gui class slayer` },
                    { text: `Berserker<br>`, command: `fps gui class berserker` },
                    { text: `Sorcerer<br>`, command: `fps gui class sorcerer` },
                    { text: `Archer<br>`, command: `fps gui class archer` },
                    { text: `Priest<br>`, command: `fps gui class priest` },
                    { text: `Mystic<br>`, command: `fps gui class sorcerer` },
                    { text: `Reaper<br>`, command: `fps gui class reaper` },
                    { text: `Gunner<br>`, command: `fps gui class gunner` },
                    { text: `Brawler<br>`, command: `fps gui class brawler` },
                    { text: `Ninja<br>`, command: `fps gui class ninja` },
                    { text: `Valkyrie<br>`, command: `fps gui class valkyrie` }
                ], `<font color="#dcc856"> FPS-UTILS Options - Skills`)
                break
            case "class":
                gui.parse(listSkills(arg), `<font color="#dcc856"> FPS-UTILS Options - Skill list for ${arg}`)
                break
            case "role":
                gui.parse([
                    { text: `<font color="#4dd0e1" size="+22">Hide classes/roles:<br><br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('warrior') ? green : red}">Warrior</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('warrior') ? `show` : `hide`} warrior;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('lancer') ? green : red}">Lancer</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('lancer') ? `show` : `hide`} lancer;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('slayer') ? green : red}">Slayer</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('slayer') ? `show` : `hide`} slayer;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('berserker') ? green : red}">Berserker</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('berserker') ? `show` : `hide`} berserker;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('sorcerer') ? green : red}">Sorcerer</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('sorcerer') ? `show` : `hide`} sorcerer;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('archer') ? green : red}">Archer</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('archer') ? `show` : `hide`} archer;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('priest') ? green : red}">Priest</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('priest') ? `show` : `hide`} priest;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('mystic') ? green : red}">Mystic</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('mystic') ? `show` : `hide`} mystic;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('reaper') ? green : red}">Reaper</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('reaper') ? `show` : `hide`} reaper;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('gunner') ? green : red}">Gunner</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('gunner') ? `show` : `hide`} gunner;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('brawler') ? green : red}">Brawler</font><br>`, command: `fps ${mod.settings.hiddenClasses.includes('brawler') ? `show` : `hide`} brawler;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenClasses.includes('ninja') ? green : red}">Ninja</font><br><br>`, command: `fps ${mod.settings.hiddenClasses.includes('ninja') ? `show` : `hide`} ninja;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenRoles.includes('dps') ? green : red}">DPS</font><br>`, command: `fps ${mod.settings.hiddenRoles.includes('dps') ? `show` : `hide`} dps;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenRoles.includes('healer') ? green : red}">Healers</font><br>`, command: `fps ${mod.settings.hiddenRoles.includes('healer') ? `show` : `hide`} healer;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenRoles.includes('tank') ? green : red}">Tanks</font><br>`, command: `fps ${mod.settings.hiddenRoles.includes('tank') ? `show` : `hide`} tank;fps gui role` },
                    { text: `<font color="${mod.settings.hiddenRoles.includes('ranged') ? green : red}">Ranged</font><br>`, command: `fps ${mod.settings.hiddenRoles.includes('ranged') ? `show` : `hide`} ranged;fps gui role` },
                ], `<font color="#dcc856"> FPS-UTILS Options - Hide Roles`)
                break
            case "abn":
                gui.parse([
                    { text: `<font color="#4dd0e1" size="+22">Abnormality/Effect Options:<br><br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` },
                    { text: `<font color="${mod.settings.blacklistAbnormies ? green : red}"> [Hide ALL Abnormalities/Effects] </font><br>`, command: `fps proj all;fps gui abn` },
                    { text: `<font color="${mod.settings.hideAllAbnormies ? green : red}"> [Hide ALL Anormalities/Effects in the blacklist (option to select these ingame soon, sorry!)] </font><br>`, command: `fps proj blacklist;fps gui abn` },
                ], `<font color="#dcc856"> FPS-UTILS Options - Abnormies`)
                break
            case "proj":
                gui.parse([
                    { text: `<font color="#4dd0e1" size="+22">Projectile Options:<br><br>` },
                    { text: `Click here to return to the main menu<br><font size="+18">`, command: `fps gui` },
                    { text: `<font color="${mod.settings.hideProjectiles ? green : red}"> [Hide ALL Projectiles] </font><br>`, command: `fps proj all;fps gui proj` },
                    { text: `<font color="${mod.settings.blacklistProjectiles ? green : red}"> [Hide ALL Projectiles in the blacklist (option to select these ingame soon, sorry!)] </font><br>`, command: `fps proj blacklist;fps gui proj` },
                ], `<font color="#dcc856"> FPS-UTILS Options - Projectiles`)
                break
            default:
                gui.parse([
                    { text: `<font color="#dcc856" size="+16">Red = disabled, green = enabled:<br>` },
                    { text: `Make sure you scroll down to see all the options!</font>:<br><font color="#4dd0e1" size="+18">` },
                    { text: `Modes (mode effects from the previous are included in the next):<br>` },
                    { text: `&#09;<font color="${mod.settings.mode === 0 ? green : red}"> [0 - Disable all other modes] </font><br>`, command: `fps mode 0;fps gui` },
                    { text: `&#09;<font color="${mod.settings.mode === 1 ? green : red}"> [1 - Hide all projectiles and disable hit effects for other players] </font><br>`, command: `fps mode 1;fps gui` },
                    { text: `&#09;<font color="${mod.settings.mode === 2 ? green : red}"> [2 - Hide skill casts] </font><br>`, command: `fps mode 2;fps gui` },
                    { text: `&#09;<font color="${mod.settings.mode === 3 ? green : red}"> [3 - Hide all players] </font><br><br>`, command: `fps mode 3;fps gui` },
                    { text: `Hit mode:<br>` },
                    { text: `&#09;<font color="${mod.settings.hitMe ? green : red}"> [Hide your own effects and damage numbers] </font><br>`, command: `fps hit me;fps gui` },
                    { text: `&#09;<font color="${mod.settings.hitOther ? green : red}"> [Hide other players hit effects] </font><br>`, command: `fps hit other;fps gui` },
                    { text: `&#09;<font color="${mod.settings.hitDamage ? green : red}"> [Hide damage numbers] </font><br><br>`, command: `fps hit other;fps gui` },
                    { text: `<font color="${mod.settings.party ? green : red}"> [Hide players not in your party] </font><br>`, command: `fps party;fps gui` },
                    { text: `<font color="${mod.settings.hideAllSummons ? green : red}"> [Hide Summons] </font><br>`, command: `fps summons;fps gui` },
                    { text: `<font color="${mod.settings.hideFireworks ? green : red}"> [Hide Fireworks] </font><br>`, command: `fps fireworks;fps gui` },
                    { text: `<font color="${mod.settings.showStyle ? green : red}"> [Hide other players costumes- requires a loading screen] </font><br><br>`, command: `fps style;fps gui` },
                    { text: `Hide Classes/Roles (click here for more options)<br><br>`, command: `fps gui role` },
                    { text: `Hide Skills (click here for more options)<br><br>`, command: `fps gui skills` },
                    { text: `Hide Players (click here for more options)<br><br>`, command: `fps gui hide` },
                    { text: `Show Players (click here for more options)<br><br>`, command: `fps gui show` },
                    { text: `NPC's (click here for more options)<br><br>`, command: `fps gui npcMain` },
                    { text: `Abnormalities/Effects (click here for more options)<br><br>`, command: `fps gui abn` }, //Need a less bad list/sorting method                    
                    { text: `Projectiles (click here for more options)<br><br>`, command: `fps gui proj` }, //Need a better list
                ], `<font color="#dcc856"> FPS-UTILS Options`)

        }
    }

    // ~~~ * commands * ~~~
    mod.command.add('fps', (cmd, arg, arg2, arg3) => {
        mod.saveSettings() // for some reason settings weren't saving so we have this here now I guess 🤷
        switch (cmd) {
            case "gui":
                if (useGui) {
                    handleGui(arg, arg2);
                } else {
                    message(`badGUI not installed, please see the FPS-Utils readme for more information`)
                }
                break;
            case "mode":
            case "state":
                switch (arg) {
                    case "0":
                    case "off":
                        if (mod.settings.mode === 3) {
                            showAll();
                        }
                        mod.settings.hideAllAbnormies = false
                        mod.settings.hitOther = false
                        mod.settings.mode = 0;
                        message(`All FPS improvements disabled`);
                        break
                    case "1":
                        if (mod.settings.mode === 3) {
                            showAll();
                        }
                        mod.settings.mode = 1;
                        //mod.settings.hideAllAbnormies = true;
                        mod.settings.hitOther = true;
                        message(`FPS mode set to 1, projectiles hidden and abnormalities disabled`);
                        break
                    case "2":
                        if (mod.settings.mode === 3) {
                            showAll();
                        }
                        mod.settings.mode = 2;
                        // mod.settings.hideAllAbnormies = true;
                        mod.settings.hitOther = true;
                        message(`FPS mode set to 2, all skill effects disabled`);
                        break
                    case "3":
                        hideAll();
                        mod.settings.mode = 3;
                        mod.settings.hideAllAbnormies = true;
                        mod.settings.hitOther = true;
                        message(`FPS mode set to 3, hiding all players, their effects and their hit effects.`);
                        break
                    default:
                        message(`Invalid mode ${arg}, valid modes are : 0,1,2,3`);
                }
                break
            case "hide":
                if (typeof arg === "string" && arg !== null) {
                    if (mod.settings.blacklistedNames.includes(arg)) {
                        message(`Player "${arg}" already hidden!`);
                        return;
                    } else
                        if ((mod.settings.classNames.includes(arg) && !mod.settings.hiddenClasses.includes(arg)) || (mod.settings.roleNames.includes(arg) && !mod.settings.hiddenRoles.includes(arg))) {
                            for (let i in mod.settings.classes) {
                                if ((mod.settings.classes[i].name === arg || mod.settings.classes[i].role.includes(arg)) && mod.settings.classes[i].isHidden !== true) { //loops are fun, right?
                                    mod.settings.classes[i].isHidden = true;
                                    if (mod.settings.classes[i].name === arg) {
                                        mod.settings.hiddenClasses.push(arg);
                                    }
                                    if (mod.settings.classes[i].role.includes(arg)) {
                                        mod.settings.hiddenRoles.push(arg);
                                    }
                                    let classtohide = mod.settings.classes[i].model;
                                    for (let i in spawnedPlayers) {
                                        if (getClass(spawnedPlayers[i].templateId) === classtohide) {
                                            hidePlayer(spawnedPlayers[i].name);
                                        }
                                    }
                                }
                            }
                            message(`Class/Role ${arg} hidden`);
                            return;
                        } else if (mod.settings.hiddenClasses.includes(arg) || mod.settings.hiddenRoles.includes(arg)) {
                            message(`Class/Role "${arg}" already hidden!`);
                            return;
                        }
                    // if (!spawnedPlayers[arg]) {
                    //   message(`Player ${arg} not spawned in, hiding anyway!`);
                    // } else {
                    message(`Player "${arg}" hidden!`);
                    // }
                    mod.settings.blacklistedNames.push(arg);
                    hidePlayer(arg);
                } else
                    message(`Invalid name "${arg}"`);
                break
            case "show":
                if (typeof arg === "string" && arg !== null) {
                    if (mod.settings.blacklistedNames.includes(arg)) {
                        showPlayer(arg);
                        removeName(mod.settings.blacklistedNames, arg);
                        message(`Player "${arg}" shown!`);
                        return;
                    }
                    if ((mod.settings.classNames.includes(arg) && mod.settings.hiddenClasses.includes(arg)) || (mod.settings.hiddenRoles.includes(arg) && mod.settings.roleNames.includes(arg))) {
                        for (let i in mod.settings.classes) {
                            if (mod.settings.classes[i].name === arg || mod.settings.classes[i].role.includes(arg)) {//loops are fun, right?
                                if (mod.settings.classes[i].name === arg) {
                                    removeName(mod.settings.hiddenClasses, arg);
                                }
                                if (mod.settings.classes[i].role.includes(arg)) {
                                    removeName(mod.settings.hiddenRoles, arg);
                                }
                                mod.settings.classes[i].isHidden = false;
                                let classToShow = mod.settings.classes[i].model;
                                for (let i in hiddenUsers) {
                                    if (getClass(hiddenUsers[i].templateId) === classToShow) {
                                        showPlayer(hiddenUsers[i].name);
                                    }
                                }

                            }
                        }
                        message(`Class "${arg}" redisplayed!`);
                    } else if (!mod.settings.hiddenClasses.includes(arg) || !mod.settings.hiddenRoles.includes(arg)) {
                        message(`Class/Role "${arg}" already displayed!!`);
                    } else
                        if (!mod.settings.blacklistedNames.includes(arg)) {
                            message(`Player "${arg}" is not hidden!`);
                        }
                }
                break
            case "party":
                mod.settings.party = !mod.settings.party
                if (mod.settings.party) {
                    for (let i in spawnedPlayers) {
                        if (!partyMembers.includes(spawnedPlayers[i].name)) {
                            mod.send('S_DESPAWN_USER', 3, {
                                gameId: spawnedPlayers[i].gameId,
                                type: 1
                            });
                            hiddenUsers[spawnedPlayers[i].gameId] = spawnedPlayers[i];
                        }
                    }
                } else {
                    showAll()
                }
                message(`Hiding of everyone but your group ${mod.settings.party ? 'en' : 'dis'}abled`);

                break
            case "list":
                message(`Hidden players: ${mod.settings.blacklistedNames}`);
                message(`Hidden classes: ${mod.settings.hiddenClasses}`);
                message(`Hidden roles: ${mod.settings.hiddenRoles}`);
                break
            case "summons":
			switch(arg){
				case undefined:	
					mod.settings.hideAllSummons = !mod.settings.hideAllSummons;
					message(`Hiding of summoned NPCs ${mod.settings.hideAllSummons ? 'en' : 'dis'}abled`);
				break;
				case "mine":
					mod.settings.keepMySummons = !mod.settings.keepMySummons;
					message(`Hiding of owned summoned NPCs ${mod.settings.keepMySummons ? 'dis' : 'en'}abled`);
				break;
			}
                break
            case "skills":
            case "skill":
                switch (arg) {
                    case "blacklist":
                    case "black":
                        mod.settings.blacklistSkills = !mod.settings.blacklistSkills;
                        message(`Hiding of blacklisted skills ${mod.settings.blacklistSkills ? 'en' : 'dis'}abled`);
                        break
                    case "class":
                        if (mod.settings.classNames.includes(arg2)) {
                            for (let i in mod.settings.classes) {
                                if (mod.settings.classes[i].name === arg2) {
                                    if (arg3 != null && !isNaN(arg3) && arg3 < 50) {
                                        if (mod.settings.classes[i].blockedSkills.includes(arg3)) {
                                            let index = mod.settings.classes[i].blockedSkills.indexOf(arg3)
                                            if (index !== -1) {
                                                mod.settings.classes[i].blockedSkills.splice(index, 1)
                                                message(`Skill ID ${arg3} showing for class ${arg2}`)
                                            }
                                            return
                                        } else {
                                            mod.settings.classes[i].blockedSkills.push(arg3)
                                            message(`Skill ID ${arg3} hidden for class ${arg2}`)
                                            return
                                        }

                                    } else {
                                        mod.settings.classes[i].blockingSkills = !mod.settings.classes[i].blockingSkills;
                                        message(`Hidding ALL skills for the class ${arg2} ${mod.settings.classes[i].blockingSkills ? 'en' : 'dis'}abled`);
                                        return;
                                    }
                                }
                            }

                        } else
                            message(`Class ${arg2} not found!`);
                        break
                }
                break
            case "npcs":
            case "npc":
                if (arg == 'hide') {
                    let found = mod.settings.hiddenNpcs.some((s) => {
                        return s.zone === arg2 && s.templateId === arg3;
                    });
                    if (found) {
                        message(`NPC form huntingZone "${arg2} with templateId "${arg3}" now showing`)
                        mod.settings.hiddenNpcs = mod.settings.hiddenNpcs.filter((obj) => {
                            return obj.zone != arg2 || obj.templateId != arg3;
                        })

                    } else {
                        message(`NPC form huntingZone "${arg2} with templateId "${arg3}" hidden`)
                        mod.settings.hiddenNpcs.push({ zone: arg2, templateId: arg3 })
                    }
                    return

                    /*mod.settings.hiddenNpcs = mod.settings.hiddenNpcs.filter((e) => { // wow an arrow thanks eslint
                        if (e.zone == arg2 || e.templateId == arg3) {
                            message(`NPC form huntingZone "${arg2} with templateId "${arg3}" now showing`)
                            return e.zone != arg2 || e.templateId != arg3
                        } else {
                            
                        }
                    })
                    mod.settings.hiddenNpcs.push({ zone: arg2, templateId: arg3 })
                    message(`NPC form huntingZone "${arg2} with templateId "${arg3}" hidden`)
                    return*/
                } else
                    mod.settings.blacklistNpcs = !mod.settings.blacklistNpcs;
                message(`Hiding of blacklisted NPCs ${mod.settings.blacklistNpcs ? 'en' : 'dis'}abled`);
                break
            case "hit":
                switch (arg) {
                    case "me":
                        mod.settings.hitMe = !mod.settings.hitMe;
                        message(`Hiding of the players skill hits ${mod.settings.hitMe ? 'en' : 'dis'}abled`);
                        break
                    case "other":
                        mod.settings.hitOther = !mod.settings.hitOther;
                        message(`Hiding of other players skill hits ${mod.settings.hitOther ? 'en' : 'dis'}abled`);
                        break
                    case "damage":
                        mod.settings.hitDamage = !mod.settings.hitDamage;
                        message(`Hiding of the players skill damage numbers ${mod.settings.hitDamage ? 'en' : 'dis'}abled`);
                        break
                    default:
                        message(`Unrecognized sub-mod.command "${arg}"!`);
                        break
                }
                break
            case "fireworks":
            case "firework":
                mod.settings.hideFireworks = !mod.settings.hideFireworks;
                message(`Hiding of firework effects ${mod.settings.hideFireworks ? 'en' : 'dis'}abled`);
                break
            case "fpsbooster9001":
            case "effects":
            case "abnormies":
                switch (arg) {
                    case "all":
                        mod.settings.hideAllAbnormies = !mod.settings.hideAllAbnormies;
                        message(`Hiding of ALL abnormality effects on players ${mod.settings.hideAllAbnormies ? 'en' : 'dis'}abled`);
                        break
                    case "blacklist":
                    case "black":
                        mod.settings.blacklistAbnormies = !mod.settings.blacklistAbnormies;
                        message(`Hiding of blacklisted abnormality effects ${mod.settings.blacklistAbnormies ? 'en' : 'dis'}abled`);
                        break
                }
                break
            case "costume":
            case "style":
                mod.settings.showStyle = !mod.settings.showStyle;
                message(`Displaying of all players as wearing default costumes ${mod.settings.showStyle ? 'en' : 'dis'}abled, you will have to leave and re-enter the zone for this to take effect`);
                break
            case "proj":
            case "projectile":
                switch (arg) {
                    case "all":
                        mod.settings.hideProjectiles = !mod.settings.hideProjectiles;
                        message(`Hiding of ALL projectile effects ${mod.settings.hideProjectiles ? 'en' : 'dis'}abled`);
                        break
                    case "blacklist":
                        mod.settings.blacklistProjectiles = !mod.settings.blacklistProjectiles;
                        message(`Hiding of ALL projectile effects ${mod.settings.blacklistProjectiles ? 'en' : 'dis'}abled`);
                        break
                }
                break
            default:
                message(`Unknown command! Please refer to the readme for more information`);
                break
        }

    });
    // ~~~ * Functions * ~~~
    function message(msg) {
        mod.command.message(`<font color="#e0d3f5">${msg}`);
    }

    function getClass(m) {
        return (m % 100);
    }

    function hidePlayer(name) {
        for (let i in spawnedPlayers) {
            if (spawnedPlayers[i].name.toString().toLowerCase() === name.toLowerCase()) {
                mod.send('S_DESPAWN_USER', 3, {
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
                mod.send('S_SPAWN_USER', 13, hiddenUsers[i]);
                delete hiddenUsers[i];
                return;
            }
        }
    }

    function hideAll() {
        if (!mod.settings.party) {
            for (let i in spawnedPlayers) {
                mod.send('S_DESPAWN_USER', 3, {
                    gameId: spawnedPlayers[i].gameId,
                    type: 1
                });
                hiddenUsers[spawnedPlayers[i].gameId] = spawnedPlayers[i];
            }
        }
    }

    function showAll() {
        for (let i in hiddenUsers) {
            mod.send('S_SPAWN_USER', 13, hiddenUsers[i]);
            delete hiddenUsers[i];
        }
    }

    function updateLoc(event) {
        mod.send('S_USER_LOCATION', 5, {
            gameId: event.gameId,
            loc: event.loc,
            dest: event.loc,
            w: event.w,
            speed: 300,
            type: 7
        });
    }

    // ~~~* Hooks * ~~~
    // note: for skills, do if classes[event.templateId].blockedSkills !== 

    mod.hook('S_LOGIN', 10, (event) => {
        myId = event.gameId;
    });

    mod.hook('S_SPAWN_USER', 13, { order: 9999 }, (event) => {
        spawnedPlayers[event.gameId] = event;
        if (mod.settings.mode === 3 || mod.settings.blacklistedNames.includes(event.name.toString().toLowerCase()) || mod.settings.classes[getClass(event.templateId)].isHidden === true || (mod.settings.party && !partyMembers.includes(event.name))) { //includes should work!!
            hiddenUsers[event.gameId] = event;
            return false;
        }
        if (mod.settings.showStyle) {
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

    mod.hook('S_USER_EXTERNAL_CHANGE', 6, { order: 9999 }, (event) => {
        if (mod.settings.showStyle && !event.gameId.equals(myId)) {
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

    mod.hook('S_SPAWN_USER', 13, { order: 99999, filter: { fake: null } }, (event) => {
        if (mod.settings.showStyle) {
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

    mod.hook('S_DESPAWN_USER', 3, { order: 999 }, (event) => {
        delete hiddenUsers[event.gameId];
        delete spawnedPlayers[event.gameId];
    });

    mod.hook('S_LOAD_TOPO', 'raw', () => {
        spawnedPlayers = {};
        hiddenUsers = {};
        hiddenNpcs = {};
    });

    mod.hook('S_LEAVE_PARTY', 1, () => {
        partyMembers = []
    })

    mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
        event.members.map((value) => {
            partyMembers.push(value.name)
        })
    })

    mod.hook('S_SPAWN_NPC', 9, (event) => {
        if (mod.settings.hideAllSummons && event.huntingZoneId === 1023) {
			if(mod.settings.keepMySummons && mod.game.me.is(event.owner)) return true;
            hiddenNpcs[event.gameId] = event; // apparently NPCs get feared and crash the client too
            return false;
        }
        if (mod.settings.blacklistNpcs) {
            for (var i = 0; i < mod.settings.hiddenNpcs.length; i++) {
                if (event.huntingZoneId == mod.settings.hiddenNpcs[i].zone && event.templateId == mod.settings.hiddenNpcs[i].templateId) {
                    hiddenNpcs[event.gameId] = event;
                    return false;
                }
            }
        }
        if (mod.settings.hideFireworks && event.huntingZoneId === 1023 && (event.templateId === 60016000 || event.templateId === 80037000)) {
            return false;
        }
    });

    mod.hook('S_DESPAWN_NPC', 3, (event) => {
        delete hiddenNpcs[event.gameId];
    });

    mod.hook('S_EACH_SKILL_RESULT', 12, { order: 200 }, (event) => {
        if (event.source.equals(myId) || event.owner.equals(myId)) {
            if (mod.settings.hitMe) {
                event.skill.id = '';
                return true;
            }
            if (mod.settings.hitDamage) {
                event.damage = '';
                return true;
            }
        }
        if (mod.settings.hitOther && (spawnedPlayers[event.owner] || spawnedPlayers[event.source]) && !event.target.equals(myId)) {
            event.skill.id = '';
            return true;
        }
    });

    mod.hook('S_USER_LOCATION', 5, (event) => {
        if (hiddenUsers[event.gameId] === undefined) {
            return;
        }
        hiddenUsers[event.gameId].loc = event.dest;
        if (hiddenUsers[event.gameId]) {
            return false;
        }
    });



    mod.hook('S_ACTION_STAGE', mod.base.majorPatchVersion >= 75 ? 8 : 7, { order: 999 }, (event) => {
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId]) {
            if (!event.target.equals(myId) && (mod.settings.mode === 2 || hiddenUsers[event.gameId])) {
                updateLoc(event);
                return false;
            }
            if (mod.settings.blacklistSkills) {
                if (typeof mod.settings.classes[getClass(event.templateId)].blockedSkills !== "undefined" && mod.settings.classes[getClass(event.templateId)].blockedSkills.includes(Math.floor((event.skill.id / 10000)))) {
                    updateLoc(event);
                    return false;
                }
            }
            if (mod.settings.classes[getClass(event.templateId)].blockingSkills) {
                updateLoc(event);
                return false;
            }
        }
    });

    mod.hook('S_START_USER_PROJECTILE', mod.base.majorPatchVersion >= 75 ? 9 : 8, { order: 999 }, (event) => { // end my life
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId] && (hiddenUsers[event.gameId] || mod.settings.mode > 0 || mod.settings.hideProjectiles)) {
            return false;
        }
        if (mod.settings.blacklistProjectiles && mod.settings.hiddenProjectiles.includes(event.skill.id)) {
            return false;
        }
    });

    mod.hook('S_SPAWN_PROJECTILE', 5, { order: 999 }, (event) => {
        if (!event.gameId.equals(myId) && spawnedPlayers[event.gameId] && (hiddenUsers[event.gameId] || mod.settings.mode > 0 || mod.settings.hideProjectiles)) {
            return false;
        }
        if (mod.settings.blacklistProjectiles && mod.settings.hiddenProjectiles.includes(event.skill)) {
            return false;
        }
    });

    mod.hook('S_FEARMOVE_STAGE', 1, (event) => { // we block these to prevent game crashes
        if ((!event.target.equals(myId) && mod.settings.mode === 3) || hiddenUsers[event.target] || hiddenNpcs[event.target]) {
            return false;
        }
    });
    mod.hook('S_FEARMOVE_END', 1, (event) => {
        if ((!event.target.equals(myId) && mod.settings.mode === 3) || hiddenUsers[event.target] || hiddenNpcs[event.target]) {
            return false;
        }
    });

    mod.hook('S_USER_MOVETYPE', 'raw', () => { //this little boi crashes us, raw due to def missing from caali
        return false;
    });

    mod.hook('S_ABNORMALITY_REFRESH', 1, (event) => {
        if (hiddenUsers[event.target]) {
            return false;
        }
    });

    mod.hook('S_ABNORMALITY_BEGIN', 2, { order: 999 }, (event) => {
        if (hiddenUsers[event.target]) {
            return false;
        }
        if (mod.settings.blacklistAbnormies && mod.settings.hiddenAbnormies.includes(event.id)) {
            return false;
        }
        if (mod.settings.hideAllAbnormies && !event.target.equals(myId) && (spawnedPlayers[event.target] && spawnedPlayers[event.source])) {
            return false;
        }
    });

};
