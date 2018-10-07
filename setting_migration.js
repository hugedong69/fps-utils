"use strict"

const DefaultSettings = {
        "mode": 0,
		"party": false,
        "hideFireworks": false,
        "hideAllAbnormies": true,
        "hideAllSummons": false,
		"keepMySummons" : true,
        "blacklistNpcs": false,
        "blacklistSkills": false,
        "blacklistAbnormies": false,
        "hideProjectiles": false,
        "hiddenAbnormies": [],
        "blacklistProjectiles": false,
        "hiddenProjectiles": [
            67379784
        ],
        "hitMe": false,
        "hitOther": true,
        "hitDamage": false,
        "showStyle": false,
        "blacklistedNames": [
            "hugedong"
        ],
        "hiddenNpcs": [],
        "classNames": [
            "warrior",
            "lancer",
            "slayer",
            "berserker",
            "sorcerer",
            "archer",
            "priest",
            "mystic",
            "reaper",
            "gunner",
            "brawler",
            "ninja",
            "valkyrie"
        ],
        "roleNames": [
            "dps",
            "healer",
            "tank",
            "ranged"
        ],
        "hiddenClasses": [],
        "hiddenRoles": [],
        "classes": {
            "1": {
                "name": "warrior",
                "model": 1,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            },
            "2": {
                "name": "lancer",
                "model": 2,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "tank"
                ],
                "isHidden": false
            },
            "3": {
                "name": "slayer",
                "model": 3,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            },
            "4": {
                "name": "berserker",
                "model": 4,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            },
            "5": {
                "name": "sorcerer",
                "model": 5,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps",
                    "ranged"
                ],
                "isHidden": false
            },
            "6": {
                "name": "archer",
                "model": 6,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps",
                    "ranged"
                ],
                "isHidden": false
            },
            "7": {
                "name": "priest",
                "model": 7,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "healer"
                ],
                "isHidden": false
            },
            "8": {
                "name": "mystic",
                "model": 8,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "healer"
                ],
                "isHidden": false
            },
            "9": {
                "name": "reaper",
                "model": 9,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            },
            "10": {
                "name": "gunner",
                "model": 10,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps",
                    "ranged"
                ],
                "isHidden": false
            },
            "11": {
                "name": "brawler",
                "model": 11,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "tank"
                ],
                "isHidden": false
            },
            "12": {
                "name": "ninja",
                "model": 12,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            },
            "13": {
                "name": "valkyrie",
                "model": 13,
                "blockedSkills": [],
                "blockingSkills": false,
                "role": [
                    "dps"
                ],
                "isHidden": false
            }
        }
    }

function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
		console.log(`FPS-UTILS - FPSUTILS has been updated, please check the readme for more info`)
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
			console.log(`FPS-UTILS - FPSUTILS has been updated, please check the readme for more info`)
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }

        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch (to_ver) {
            /*case 2:
                // Upgrade from v1 to v2
                // EXAMPLE: in v1, colors were specified like "reset_font_color": "green", but we support arbitrary hex colors now!
                switch (settings.reset_font_color) {
                    case "red": settings.reset_font_color = "#FF0000"; break;
                    case "green": settings.reset_font_color = "#00FF00"; break;
                    case "blue": settings.reset_font_color = "#0000FF"; break;
                    default: settings.reset_font_color = DefaultSettings.reset_font_color; break;
                }
                break;
            case 3:
                // upgrade from v2 to v3
                // EXAMPLE: setting "random_color" was removed (note that it's also absent from DefaultSettings, which should always correspond to the latest version!)
                delete settings.random_color;
                break;
            // ...
            // TODO: whenever you increment your settings version, add an entry to the switch here.
            // ...*/
        }

        return settings;
    }
}

module.exports = MigrateSettings;