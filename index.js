//FpsUtils revision 1.5.7- ALL HAIL SEREN
//Credits to Seren, Xiphon, TeraProxy, Saegusa & Bernkastel for code and ideas
/*
Changelog:
1. Reworked various commands, shortened some stuffs.
2. Added specific skill, summon and effect blacklist (db.json)
3. Added config saving (config.json)
4. Added automatic saving feature to config.json after every command use (set AUTO_SAVE to true)
5. Neaten code, combined various code fragments where possible
6. Correct Last state (Fixes respawning player bugs when going back to mode 1/2)

TODO:
Remove saving of hiddenPlayers/ add option to do so- This uses memory in populated regions...
Add more hidden skills and summons when possible. Eg: gunner/brawler laggy skills, various skills when awakening comes, especially that king thrall
Save config on logout too.

Custom Hidden Objects, with the type of id to input in db.json:
Hidden Skills (skill id-0x4000000 or dbid): Hailstorm, Regeneration Circle, Sundering Strike
Hidden Summons (template id): Thrall of wrath, Healing totem, Ninja 'Decoy Jutsu' totem 
Hidden Effect (abnormality id): Growing Fury, Ragnarok


Options:
Config.Json Options are listed below :
	state:1,				//Default Fps-Utils Mode to always start game with (0,1,2 or 3)
    hide: {					//True: Hides that class/role from spawning
		tanks: false,
		dps: false,
		healers: false,
        ranged: false,
        warrior: false,
        lancer: false,
        slayer: false,
        berserker: false,
        sorcerer: false,
        archer: false,
        priest: false,
        reaper: false,
        gunner: false,
        ninja: false,
        valkyrie: false
	},
    fireworks: false,		//True: Disable Dragon fireworks
    hitme: false,			//True: Disable hit effects on you
    damage: false, 			//True: Disable damage numbers
    heal: false, 			//True: Disable heal effects
    hit: true,				//True: Disable hit effects on others 
    logo: false,			//True: Disable Guild logos
    tcremove: false, 		//True: Disable notifications of Traverse Cut (TC) buffs
    tc: true, 				//True: Shows TC refreshes at a reduced rate (once every 7 hits by default)
    tcp: true, 				//True: Party abnormality refresh spam
	blockSkill:true, 		//True: Blocks certain blacklisted skills
	blockUserSkill:false, 	//True: Blocks user skills as well
	blockSummon:true, 		//True: Blocks laggy summons (Thralls etc...)
	blockUserSummon:false, 	//True: Blocks user summon as well
	blockEffect:true		//True: Blocks Growing Fury and Ragnarok effects on other users		
	hiddenPeople:[],		//Default Hidden Character names. Remember to use " " to enclose the ign, in lower case.
*/

const AUTO_SAVE = false		//True: Always save applied settings when using commands.
	


//================================================== DO NOT MAKE CHANGES BELOW THIS LINE ===========================================================================================================
const Command = require('command'),
	fs = require('fs'),
	path = require('path')
	


module.exports = function FpsUtils(dispatch) {

	try {db = require('./db.json')} 
	catch (e) {
		console.log('(FPS Utils) - No DB file detected, creating...')
        db = {
            "version": 1,
            "classes":{
                "ranged":[5,6,10],
                "dps":[1,3,4,5,6,9,10,12,13],
                "healers":[7,8],
                "tanks":[2,11],
                "warrior":[1],
                "lancer":[2],
                "slayer":[3],
                "berserker":[4],
                "sorcerer":[5],
                "archer":[6],
                "priest":[7],
                "mystic":[8],
                "reaper":[9],
                "gunner":[10],
                "brawler":[11],
                "ninja":[12],
                "valkyrie":[13]
            },
            "hiddenskill":[270900,21400,40330,40320,40300],
            "hiddensummon":[12345,1024001,1023405,10238007],
            "hiddeneffect":[10153040,10155130,31100],
            "hiddenheal":[10154031,700409,701606,701607]
        }
		saveDb()
    }
    if (db.version !== 1){ 		//Remember to change version number for updates
		console.log('[FPS Utils] Outdated DB file detected, updating...')
        Object.assign(db,{})	//Replace {} with updating object.Eg {"version":1.1,"newKey":1,"newKey2":[1,2]}
		db.hiddenskill.push()	//To Prevent replacing user customized array, Use pushes for array based Object values. This is just an example.
        saveDb()
    }
    //config
    try {flags = require('./config.json')}
	catch(e) {
        console.log('(FPS Utils) - No config file detected, creating...')
        flags = {
			"version": 1,
			"state": 1,
			"hide": {
				"tanks": false,
				"dps": false,
				"healers": false,
				"ranged": false,
				"warrior": false,
				"lancer": false,
				"slayer": false,
				"berserker": false,
				"sorcerer": false,
				"archer": false,
				"priest": false,
				"reaper": false,
				"gunner": false,
				"ninja": false,
				"valkyrie": false
			},
			"fireworks": false,
			"hitme": false,
			"damage": false,
			"heal": false,
			"hit": true,
			"logo": false,
			"tcremove": false,
			"tc": true,
			"tcp": true,
			"blockSkill": true,
			"blockUserSkill": false,
			"blockSummon": true,
			"blockUserSummon": false,
			"blockEffect": true,
			"hiddenPeople": []
		}
        saveConfig()
    }
    if (flags.version !== 1){		//Remember to change version number for updates (if new version is 1.1, change to 1.1!)
        console.log('[FPS Utils] Outdated config file detected, updating...');
        Object.assign(flags,{})		//Replace {} with updating object.Eg {"version":1.1,"newKey":true,"newKey2":false,"tcp":false}
        saveConfig()
    }
    
    

  let DEBUG = false,
		player,
        pcid,
		loginmsg,
        clss,
        tchits = 7, //Change this to fine tune TC spamage
        counter = 0,
        dur,
        laststate,
		summonid = [],
        locx = [],
        locy = [],
        state = flags.state, 
        hiddenPlayers = {},
        hiddenIndividual = {}
		
    const command = Command(dispatch),
		  classes = db.classes
	
	
//////Commands:	
    command.add('fps', (setting, value) => {
        switch (setting) {
			
            case "help": 
				command.message('Commands:\n' +
                    ' |fps mode| [1, 2, 3, off]" (Sets the FPS mode, 1 = hides skill particles, 2 = hides animations, 3 = hides players. Also turns fps hit on. e.g. "fps mode 1"),\n' +
                    ' |fps hit| [on, me, damage](Hides hit effects, on = hides other players hit effects, me = hides your own, damage = hides damage numbers e.g. "fps hit damage"),\n' +
                    ' |fps tc| [remove, party, on](Defaults = on, party)(on = refreshes Traverse Cut every 7th hit- see db, party = hides party members TC buffs, remove = locks the duration to 0 e.g. "fps tc on" ),\n' +
                    ' |fps hide| [playername, class, role] (Hides specific players. e.g. "fps hide dps"),\n' +
                    ' |fps show| [playername, class, role] (Unhides specific players. e.g. "fps unhide Spacecats"),\n' +
                    ' |fps list| (Displays a list of all hidden players. e.g. "fps list"),\n' +
                    ' |fps logo| (Hides guild logos on players, requires the area to be re-entered e.g. "fps logo"),\n' +
                    ' |fps fireworks| (Hides annoying fireworks e.g. "fps fireworks"),\n' +
					' |fps block| [skill,skilluser,summon,summonuser,effect] (Hides specific skills/summons/abnormality)'
                )
                break
				
            case "mode":
				switch(value) {
					// State 0: Turns off fps-utils
					case "0":
						state = 0
						log('Fps-utils optimization disabled by client.')
						command.message('Optimization disabled by user. [mode 0]')
						if (laststate === 3) redisplay()
						laststate = state
                        break
							
                    // State 1: Only hide projectiles.
					case "1":
						state = 1
						flags.hit = true
						log('fps-utils optimization set to stage 1, disabling skill particles.')
						command.message('Optimization set to remove skill particles. [mode 1]')
						if (laststate === 3) redisplay()
						laststate = state
						break
				
                    // State 2: Hide all skill animations.
					case "2":
						state = 2
						flags.hit = true
						log('fps-utils optimization set to stage 2, disabling skill animations.')
						command.message('Optimization set to remove skill animations and hit effects. [mode 2]')
						if (laststate === 3) redisplay()
						laststate = state
						break
							
                   // State 3: Hide all other players.
                    case "3":
						state = 3
						flags.hit = true
						log('fps-utils optimization set to stage 3, disabling other player models.')
						command.message('Optimization set to remove other player models. [mode 3]')
						laststate = state
                        for(let pl in hiddenPlayers) despawnUser(pl) //Despawn all players
                        break
						
					default:
						command.message('Missing command arguments, "fps mode [0, 1, 2, 3]"')
				}
				flags.state = state
                break
				
			case "save":
				saveConfig()
                break
				
            case "fireworks":	// Disable fireworks.
                flags.fireworks = !flags.fireworks
                log('fps-utils toggled fireworks: ' + flags.fireworks)
                command.message(`Fireworks toggled off: ${flags.fireworks}`)
                break

            case "hit":	//disable players attack markers
				switch (value) {
					case "me":
						flags.hitme = !flags.hitme
						log('fps-utils toggled users hit effects: ' + flags.hitme)
						command.message(`User hit effects turned off: ${flags.hitme}`)
						break

					case "on":
						flags.hit = !flags.hit
						log('fps-utils toggled hit effects on others: ' + flags.hit)
						command.message(`Player hit effects on others turned off: ${flags.hit}`)
						break
						
					case "damage":
						flags.damage = !flags.damage
						log('fps-utils toggled player damage numbers: ' + flags.damage)
						command.message(`Player damage numbers toggled off: ${flags.damage}`)
						break
						
					case "heal":
						flags.heal = !flags.heal
						log('fps-utils toggled player damage numbers: ' + flags.heal)
						command.message(`Player damage numbers toggled off: ${flags.heal}`)
						break
						
					default:
						command.message(`Missing command arguments, "fps hit [on, me, damage]"`)
				}	
                break
				
            case "logo":  // Disable guild logos
                flags.logo = !flags.logo
                log('fps-utils toggled guild logos: ' + flags.logo)
                command.message(`toggled guild logos off: ${flags.logo}`)
                break
				
               
            case "tc":  // Hide TC abnormality spam
				switch (value) {
					case "remove":
						flags.tcremove = !flags.tcremove
						command.message('TC buff will not refresh:' + flags.tcremove)
						log('fps-utils toggled showing TC refreshes: ' + flags.tcremove)
						break
						
					case "party":
						command.message('TC buff will not be shown on party members:' + flags.tcp)
						log('fps-utils toggled showing TC refreshes: ' + flags.tcp)
						break
						
					case "on":
						flags.tc = !flags.tc
						log('Smart TC fix enabled ' + flags.tc)
						command.message(`toggled toggled smart TC fix: ${flags.tc}`)
						break
						
					default:
						command.message(`Missing command arguments, "fps tc [remove,party,on]"`)
				}
                break
				
            case "hide":  // Toggle individual classes on and off
                if (value === null || value === undefined || value === "") {
                    command.message(`Missing arguments for command "hide" [dps, healers, tanks], [username] or [class]`)
                    break
                }
				
                else 
                    for (let pl in hiddenPlayers) {
                        if (hiddenPlayers[pl].name.toLowerCase() === value.toLowerCase()) {
                            command.message(`Player ${hiddenPlayers[pl].name} is added to the hiding list.`)
                            hiddenIndividual[hiddenPlayers[pl].gameId] = hiddenPlayers[pl]
                            flags.hiddenPeople.push(hiddenPlayers[pl].name.toString())
                            despawnUser(pl)
							return
                        }
                    }
					
				if (state < 3 && flags.hide[value.toLowerCase()] === false) { //Cannot use ! else outputs true.
					flags.hide[value.toLowerCase()] = true
					command.message(`All ${value}'s hidden`)
						
                    for (let pl in hiddenPlayers) {
						if (!hiddenIndividual[hiddenPlayers[pl].gameId] && (classes[value].indexOf(getClass(hiddenPlayers[pl].templateId)) > -1)) despawnUser(pl)
					}
				}
				
				else
					command.message('Invalid argument for command "hide" [dps, healers, tanks], [username] or [class] ')
                break


            case "show":	// Try to respawn all hidden players included in show command.
                if (value === null || value === undefined || value === "") {
                    log('fps-utils missing arguments for command "show"')
                    command.message(`Missing arguments for command "show" [dps, ranged, healers, tanks] or [username]`)
                    break
                }
				
                else                               
                    for (let pl in hiddenIndividual) {
                        if (hiddenIndividual[pl].name.toLowerCase() === value.toLowerCase()) {
                            command.message(`Showing player ${hiddenIndividual[pl].name}.`)
                            flags.hiddenPeople.splice(flags.hiddenPeople.indexOf(hiddenPlayers[pl].name), 1)
                            dispatch.toClient('S_SPAWN_USER',11, hiddenIndividual[pl])
                            delete hiddenIndividual[pl]
                        }
						return
                    }
					
                if (state < 3 && flags.hide[value.toLowerCase()]) {
					flags.hide[value] = false
					log('fps-utils showing: ' + value)
					command.message(`Showing ${value}`)
                    for (let pl in hiddenPlayers) {
						if (classes[value].indexOf(getClass(hiddenPlayers[pl].templateId)) > -1 && !hiddenIndividual[hiddenPlayers[pl].gameId]) {
							dispatch.toClient('S_SPAWN_USER',11, hiddenPlayers[pl])
                        }
					}
                }
				
				else
					command.message('Invalid arguments for command "show" [dps, healers, tanks], [username] or [class] ')
                break
				
            case "list":  // List the players in individuals list.
                let hiddenArray = []
                for (let pl in hiddenIndividual) hiddenArray.push(hiddenIndividual[pl].name)
                command.message(`Manually hidden players: ${hiddenArray}`)
                break
				
			case "block":
				switch(value) {
					case "skill":
						flags.blockSkill=!flags.blockSkill
						command.message(`Hiding blacklisted skills:${flags.blockSkill}`)
						break
					case "skilluser":
						flags.blockUserSkill=!flags.blockUserSkill
						command.message(`Hiding blacklisted skills for User:${flags.blockUserSkill}`)
						break
					case "summon":
						flags.blockSummon=!flags.blockSummon
						command.message(`Hiding blacklisted summons:${flags.blockSummon}`)
						break
					case "summonuser":
						flags.blockUserSummon=!flags.blockUserSummon
						command.message(`Hiding blacklisted summons for User:${flags.blockUserSummon}`)
						break
					case "effect":
						flags.blockEffect=!flags.blockEffect
						command.message(`Hiding blacklisted effects:${flags.blockEffect}`)	
						break	
					default:
						command.message('Command not recognised. Only use "fps block [skill,skilluser,summon,summonuser,effect]"')
				}
				break
						
            default:
                command.message('Command not recognized. Use [fps help] for a list of available commands')
                break
        }

        if(AUTO_SAVE) saveConfig()
    })
	
	/*command.add('fpsdebug', (string, add) => {  //DO NOT USE unless for debugging!
		console.log(JSON.stringify(eval(string)))
	})*/
	
/////Dispatches
    dispatch.hook('S_LOGIN', 9, (event) => {
        pcid = event.gameId
        player = event.name
        clss = getClass(event.templateId)
        job = (event.templateId - 10101) % 100
		console.log(`[FPS UTILS] Mode:${state} Hitme:${flags.hitme} Damage:${flags.damage} Hit:${flags.hit}`) 
    })
	

    dispatch.hook('S_LOAD_TOPO', 'raw', () => {
        // Refresh the hide list upon teleport or zone change.
        hiddenPlayers = {}
		summonid = []
    })

    dispatch.hook('S_SPAWN_USER', 11, (event) => {

        // Add players in proximity of user to possible hide list.
        hiddenPlayers[event.gameId] = event

        // Check the state or if the individual is hidden.
        if (state === 3 || hiddenIndividual[event.gameId]) {
            return false
        }

        // Hide dps enabled, remove dps characters;
        if (flags.hide.dps && classes.dps.indexOf(getClass(event.templateId)) > -1) {
            return false
        }

        //hide ranged enabled, delet ranged characters;
        if (flags.hide.ranged && classes.ranged.indexOf(getClass(event.templateId)) > -1) {
            return false
        }

        // Hide tanks enabled, remove tank characters;
        if (flags.hide.tanks && classes.tanks.indexOf(getClass(event.templateId)) > -1) {
            return false
        }

        // Why would you want this on, seriously...
        if (flags.hide.healers && classes.healers.indexOf(getClass(event.templateId)) > -1) {
            return false
        }
		
		if (flags.logo) {
          event.guildEmblem = ''
            return true
        }
    })

    dispatch.hook('S_DESPAWN_USER', 3, (event) => {
        delete hiddenPlayers[event.gameId]
		
		
        if (state === 3 || hiddenIndividual[event.gameId]) {
            return false
        }
    })

    dispatch.hook('S_SPAWN_NPC',4, (event) => {
		if(event.huntingZoneId !== 1023) return		//huntingZoneId=1023 for all Players summons
		
        if(flags.fireworks) {
            if(event.templateId === 60016000 || event.templateId === 80037000) return false
		}
		
		if(db.hiddensummon.includes(event.templateId)) {
			if(flags.blockSummon && (flags.blockUserSummon || !event.owner.equals(pcid))) {
				summonid.push(event.id.low)
				return false
			}	
		}
		
    })
	
	dispatch.hook('S_DESPAWN_NPC', 1, event => {
		if(summonid.includes(event.target.low)) {
			summonid.splice(summonid.indexOf(event.target.low),1)
		}
	})
	
    dispatch.hook('S_EACH_SKILL_RESULT',4, {order: 999}, (event) => {
		if(flags.heal && event.type === 2) {
			event.skill = ''
			return true
        }
		
        if(event.source.equals(pcid) || event.owner.equals(pcid)) {
            if (flags.damage) {
                event.damage = ''
                return true
            }
            if (flags.hitme) {
                event.skill = ''
                return true
            }
        }
		
        if(flags.hit) {
            if (hiddenPlayers[event.source] || hiddenPlayers[event.owner]) {
                event.skill = ''
                event.type = ''
                event.type2 = ''
                return true
            }
        }
		
    })
	

    dispatch.hook('S_ABNORMALITY_BEGIN', 2, {order: 999}, event => {
        if (flags.heal)	{ //??
            if(db.hiddenheal.includes(event.id)) return false
        }
        if (flags.tc) { //abnormality begin doesn't cause the lag but whatevs
            if (event.id === 101300) {
                event.duration = 0
                return true
            }
        }
		if (flags.blockEffect) {
			if (!event.source.equals(pcid) && db.hiddeneffect.includes(event.id)) return false
		}

    })
	
    dispatch.hook('S_PARTY_MEMBER_ABNORMAL_ADD',3, {order: 999}, (event) => {
        if (event.id === 101300 && flags.tcp) return false
    })
	
    dispatch.hook('S_ABNORMALITY_REFRESH',1, {order: 999}, (event) => {
        if (flags.heal) {
			if(db.hiddenheal.includes(event.id)) return false
		}
		 
        if (event.id === 101300 && flags.tc) {
            dur = event.duration
            counter = counter + 1
            if (counter >= tchits) {
                counter = 0
                event.duration = dur
                return true
            } 
			
			else
                return false
        }
		
        if (event.id === 101300 && flags.tcremove) return false

    })

    dispatch.hook('S_USER_LOCATION',1,(event) => {
        if(hiddenPlayers[event.target] === undefined) return
        // Update locations of every player in case we need to spawn them.
        hiddenPlayers[event.target].x = event.x2
        hiddenPlayers[event.target].y = event.y2
        hiddenPlayers[event.target].z = event.z2
        hiddenPlayers[event.target].w = event.w
        if (state > 2 || hiddenIndividual[event.target]) return false

    })

    dispatch.hook('S_ACTION_STAGE', 1, (event) => {
        if(state === 2 && (Math.abs(event.x - locx[event.source.low]) > 15 || Math.abs(event.y - locy[event.source.low]) > 15) && (hiddenPlayers[event.source] || hiddenIndividual[event.source])) {
            dispatch.toClient('S_USER_LOCATION', 1,{
                target: event.source,
                x1: locx[event.source.low],
                y1: locy[event.source.low],
                z1: event.z,
                w: event.w,
                unk2: 0,
                speed: 300,
                x2: event.x,
                y2: event.y,
                z2: event.z,
                type: 0,
                unk: 0
            })
            locx[event.source.low] = event.x //.low should be enough
            locy[event.source.low] = event.y 
			return false
        }
		
		// If state is higher than state1 remove all skill animations.    
        else if(state > 1 && (hiddenPlayers[event.source] || hiddenIndividual[event.source])) return false

		
		if(flags.blockSkill && db.hiddenskill.includes(event.skill-0x4000000)) {  //Check skill first
			if(flags.blockUserSkill || !event.source.equals(pcid)) return false
		}
		
		if(summonid.includes(event.source.low)) return false
    })

    /*dispatch.hook('S_ACTION_END', 1, (event) => { 
        // If we're removing skill animations we should ignore the end packet too. // wrong
        if (state > 1 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
          return false;
    })*/

    dispatch.hook('S_START_USER_PROJECTILE', 1,(event) => {
        // State 1 and higher ignores particles and projectiles so we're ignoring this.
        if (state > 0 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false
    })

    dispatch.hook('S_SPAWN_PROJECTILE', 1,(event) => {
        // Ignore the projectile spawn if enabled in state.
        if (state > 0 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false
    })

	
	
//////Functions	
    function log(msg) {if(DEBUG) console.log('[fps-utils] ' + msg)}

	function getClass(m) {return (m % 100)}
	
    function saveConfig() {
		fs.writeFile(path.join(__dirname,'config.json'), JSON.stringify(flags,null,"\t"), err => {
			if (err) console.log('(FPS Utils) Config file failed to overwrite. Use "fps save" command to save again.')
			else
				console.log('(FPS Utils) Config file saved!') // I am too lazy to unfuck this at the present moment
		})
	}
	
    function saveDb() { //Idk how else you can simplify this formatting method 
		fs.writeFile(path.join(__dirname,'db.json'), JSON.stringify(db, (k,v)=> {if(v instanceof Array) return JSON.stringify(v);return v} , "\t").replace(/\"\[/g, '[').replace(/\]\"/g,']'), err => { 
			if (err) console.log('(FPS Utils) DB file failed to overwrite. Use "fps save" command to save again.')
			else
				console.log('(FPS Utils) DB file saved!') // I am too lazy to unfuck this at the present moment
		})
	}
	
	
	function redisplay() {
		for (let pl in hiddenPlayers) {
			if(!hiddenIndividual[hiddenPlayers[pl].gameId]) {
				dispatch.toClient('S_SPAWN_USER',11, hiddenPlayers[pl])
			}
		}
     
	}
	
	function despawnUser(pl) {
		dispatch.toClient('S_DESPAWN_USER',3, {
			gameId: hiddenPlayers[pl].gameId,
            type: 1
		})
	}
}
