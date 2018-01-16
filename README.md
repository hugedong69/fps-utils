# fps-utils

  Written for tera-proxy, a free script filled with features dedicated to improve your fps, in the open world and in dungeons.
  edited by me, hugedong, to add more things ;3c!!
  full rewrite coming soon!

  **To support development of this mod**:
  
  throw money [here](https://www.patreon.com/saegusa) where you can show your support for him!
  
  buy me a [covfefe](https://ko-fi.com/hugedong) (I can't actually drink coffee)

### Note
This **huge** update was 100% all done by [SerenTera](https://github.com/SerenTera) please go check their stuff out because it's way better than anything I've ever done.

## How to use:
* Setup tera-proxy pinkie just see [Caali's proxy!](https://discord.gg/maqBmJV) Or [Pinkie's proxy!](https://discord.gg/3zpEVTa)

***Note***:If youre using caali's Proxy fps utils will be autoupdated
* put the script folder "fps-utils" into bin/node_modules
* Log the game using the proxy.
* Now you have access to fps-utils commands
* Default commands can be found in index.js

## Commands:
***Note:*** *When inputting commands directly from the **proxy channel**  the prefix `!` should be ignored.*

Command | Argument(s) | Example | Description
---|---|---|---
**!fps mode** | 1, 2, 3, off | !fps mode [state] | Sets the current fps-utils oprtimization state. 0 disables, 1 hides particles, 2 hides skill animations, 3 hides all players. Also turns fps hit on.
**!fps tc** | remove, party, on | !fps tc remove | Hides traverse cut spam, by default this is turned on. *Remove* stops the buff from being refreshed except for when it ends, *party*" turns the effect off/on on other players.
**!fps hit** | me, damage, on | !fps hit damage | Enables/Disables hiding of hit effects for the player. *Damage* toggles damage numbers off. *Me* turns hit effects off for the player (disables damage numbers also unfortunately).
**!fps hide** | <playername>, dps, healers, tanks, ranged, class | !fps hide [args] |hides dps, healers, tanks ranged any username or a class name , class names can be found in config.js.
**!fps show** | playername, dps, healers, tanks, ranged, class| !fps show [args] | Again takes *healers*, *tanks*, *any username* or *class* as a sub argument, tries to show all hidden characters of said specifics on the screen.
**!fps list** |  | !fps list |  Prints a list of characters currently hidden by *hide* command to chat.
**!fps fireworks** |  | !fps fireworks | Enables/Disables hiding of firework entities in open world.
**!fps logo** |  | !fps logo | Enables/Disables hiding of guild logos, will require players to be reloaded (enter/exit the area)
**!fps block**|skill,skilluser,summon,summonuser,effect| !fps block skill| Toggle to hide specific skills,apply hidden skill to user as well, summons, apply hidden summon to user as well and abnormality respectively. This means if you activate summonuser and you are a mystic, you cannot see thrall of wrath and healing totem. Blocked skill list in changelog above or index.js


## Update Log:
1. Reworked various commands, shortened some stuffs.
2. Added specific skill, summon and effect blacklist (db.json)
3. Added config saving (config.json)
4. Added automatic saving feature to config.json after every command use (set AUTO_SAVE to true)
5. Neaten code, combined various code fragments where possible
6. Correct Last state (Fixes respawning player bugs when going back to mode 1/2)
### Additional commands:
` fps block [skill,skilluser,summon,summonuser,effect]` - Hides specific skills,apply hidden skill to user as well,summons, apply hidden summon to user as well and abnormality respectively. This means if you activate summonuser and you are a mystic, you cannot see thrall of wrath and healing totem. Blocked skill list in changelog above or index.js.

## Work In Progress:
* Overall improvements.
* Adding aliasing for commands
* ~~Save configuration upon exit to remember last state.~~
* ~~Revive !fps 2 to it's full glory and screw this "2 IS A MEME" gaem.~~
* ~~Add support for hiding ranged dps and certain classes~~
* ~~Rewrite and command support~~

## Suggestions:
* If you have suggestions, need help, or want to comment on my shitty coding, leave an issue report or message me (Hugedong69 on pinkies discord)
