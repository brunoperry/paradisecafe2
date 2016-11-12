var appData = {

    "scenes": [
        {
            "id": 0,
            "name": "splash_scene",
            "images": ["splash_bckgrd01", "splash_bckgrd02", "splash_bckgrd03"],
            "animations":
            {
                "background": [0, 1, 0, 2]
            }
        },
        {
            "id": 1,
            "name": "main_scene",
            "images": ["main_bckgrd01", "main_bckgrd02"],
            "animations":
            {
                "background": [0, 1]
            }
        },
        {
            "id": 2,
            "name": "street_scene",
            "images": ["street_bckgrd01", "splash_bckgrd02", "splash_bckgrd03"],
            "animations":
            {
                "background": [0]
            }
        },
        {
            "id": 3,
            "name": "jail_scene",
            "images": ["jail_bckgrd01", "jail_bckgrd02"],
            "animations":
            {
                "background": [0, 1]
            }
        },
        {
            "id": 4,
            "name": "brothel_scene",
            "images": ["brothel_bckgrd01"],
            "animations":
            {
                "background": [0]
            }
        },
        {
            "id": 5,
            "name": "paradisecafe_scene",
            "images": ["paradisecafe_bckgrd01", "paradisecafe_bckgrd02", "paradisecafe_bckgrd03", "paradisecafe_bckgrd04"],
            "animations":
            {
                "background": [0, 1, 2, 3]
            }
        },
        {
            "id": 6,
            "name": "records_scene",
            "images": ["records_bckgrd01", "records_bckgrd02"],
            "animations":
            {
                "background": [0, 0, 1, 1]
            }
        }
    ],
    "characters": [
        {
            "id": 0,
            "name": "hero",
            "images": 
                [
                    "hero_street_idle_left",
                    "hero_street_idle_front",
                    "hero_street_idle_right",
                    "hero_walk01",
                    "hero_walk02",
                    "hero_walk03",
                    "hero_walk04",
                    "hero_show_docs",
                    "hero_enter_building01",
                    "hero_enter_building02",        //10
                    "hero_enter_building03",
                    "hero_idle_brothel",
                    "hero_idle_gun",
                    "hero_rape01",
                    "hero_rape02",
                    "hero_rape03",
                    "hero_rape04",
                    "hero_rape05",
                    "hero_idle_cafe",
                    "hero_blowjob01",               //20
                    "hero_blowjob02",
                    "hero_bend",
                    "hero_anal01",
                    "hero_anal02",
                    "hero_sex01",
                    "hero_sex02",
                    "hero_drink01",
                    "hero_drink02",                //28
                    "hero_rob_scout01",
                    "hero_rob_scout02",
                    "hero_rob_scout03",
                    "hero_rob_scout04",
                    "hero_rob_scout05",
                    "hero_rob_scout06"
                ],
            "animations":
            {
                "street_idle_left": [0],
                "street_idle_front": [1],
                "street_idle_right": [2],
                "walk": [3, 4, 5, 6],
                "show_docs": [7],
                "enter_building": [8, 9, 10],
                "brothel_idle": [11],
                "gun_idle": [12],
                "undress": [13, 14, 15],
                "rape": [16, 17],
                "dress": [15, 14, 13],
                "cafe_idle": [18],
                "oral": [19, 20],
                "bend": [21],
                "anal": [22, 23],
                "sex": [24, 25],
                "drink": [18, 26, 27, 27, 27, 27, 27, 26, 18],
                "rob_scout": [28, 29, 30, 31, 32, 33]
            }
        },
        {
            "id": 1,
            "name": "police",
            "images": 
                [
                    "police_show01",
                    "police_show02",
                    "police_show03",
                    "police_action"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_door": [2],
                "action": [3],
            }
        },
        {
            "id": 2,
            "name": "whore",
            "images": 
                [
                    "whore_show01",
                    "whore_show02",
                    "whore_show03",
                    "whore_idle_brothel",
                    "whore_blowjob01",
                    "whore_blowjob02",
                    "whore_anal01",
                    "whore_anal02",
                    "whore_sex01"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
                "idle_brothel": [3],
                "oral": [4, 5],
                "anal": [6, 7],
                "sex": [8]
            }
        },
        {
            "id": 3,
            "name": "oldlady",
            "images": 
                [
                    "oldlady_show01",
                    "oldlady_show02",
                    "oldlady_show03",
                    "oldlady_bended01",
                    "oldlady_bended02",
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
                "bend": [2, 3, 4],
                "unbend": [4, 3, 2]
            }
        },
        {
            "id": 4,
            "name": "thief",
            "images": 
                [
                    "thief_show01",
                    "thief_show02",
                    "thief_show03",
                    "thief_show04",
                    "thief_gun",
                    "thief_hide01",
                    "thief_hide02",
                    "thief_hide03",
                    "thief_pull_cigar01",
                    "thief_pull_cigar02",
                    "thief_hurt01",
                    "thief_hurt02",
                    "thief_hurt03"
                ],
            "animations":
            {
                "show": [0, 1, 2, 3],
                "gun": [4],
                "hide": [5, 6, 7],
                "pull_cigar": [3, 8, 9],
                "unpull_cigar": [9, 8, 3],
                "hurt": [10, 11, 12, 12, 12, 12, 12, 12]
            }
        },
        {
            "id": 5,
            "name": "pimp",
            "images": 
                [
                    "pimp_show01",
                    "pimp_show02",
                    "pimp_idle",
                    "pimp_rape01",
                    "pimp_rape02"
                ],
            "animations":
            {
                "show": [0, 1, 1, 1],
                "idle": [2],
                "rape": [3, 4]
            }
        },
        {
            "id": 6,
            "name": "waitress",
            "images": 
                [
                    "waitress_show01",
                    "waitress_show02",
                    "waitress_show03",
                    "waitress_serve",
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "idle": [2],
                "serve": [3, 3, 3, 3, 3, 3],
                "hide": [2, 1, 0]
            }
        },
        {
            "id": 7,
            "name": "dealer",
            "images": 
                [
                    "dealer_show01",
                    "dealer_show02",
                    "dealer_show03",
                    "dealer_show04"
                ],
            "animations":
            {
                "show": [0, 1, 2, 3],
                "idle": [2],
                "hide": [3, 2, 1, 0]
            },
            drugs_avail: ["lsd", "weed"]

        },
        {
            "id": 8,
            "name": "scout",
            "images": 
                [
                    "scout_show01",
                    "scout_show02",
                    "scout_show03",
                    "scout_salute01",
                    "scout_salute02",
                    "scout_salute03",
                    "scout_hide01",
                    "scout_hide02",
                    "scout_hide03",
                    "scout_fear"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "salute": [3, 4, 5],
                "hide": [2, 1, 0],
                "hide_robbed": [6, 7, 8],
                "idle": [9]
            }
        }
    ],
    "hud": {
        "images": 
            [
                "icons_gun_on",
                "icons_gun_off",
                "icons_wallet_on",
                "icons_wallet_off"
            ],
        "states":
        {
            "gun_on": 0,
            "gun_off": 1,
            "wallet_on": 2,
            "wallet_off": 3
        }
    },
    "door":
    {
        "id": 0,
        "name": "door",
        "images": ["door_scroll", "door_open01", "door_open02", "door_cafe01", "door_cafe02", "door_cafe03", "door_cafe04"],
        "animations":
        {
            "scroll": [0],
            "open": [0, 1, 2],
            "close": [2, 1, 0],
            "show_cafe": [3, 4, 5, 6]
        },
        "actions": 
            [
                "street_action",
                "police_action",
                "whore_action",
                "thief_action",
                "oldlady_action",
                "cafe_action",
                "scout_action"
            ]
    }
}   