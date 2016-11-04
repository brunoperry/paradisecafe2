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
                    "hero_enter_building02",
                    "hero_enter_building03",
                    "hero_idle_brothel",
                    "hero_idle_gun",
                    "hero_rape01",
                    "hero_rape02",
                    "hero_rape03",
                    "hero_rape04",
                    "hero_rape05",
                    "hero_idle_cafe"
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
                "cafe_idle": [18]
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
                    "whore_idle_brothel"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
                "idle_brothel": [3]
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
        }
    ],
    "keys": [
        {
            "id": 0,
            "label": "JOGAR",
            "action": "key-play"
        },
        {
            "id": 1,
            "label": "HISCORES",
            "action": "key-scores"
        },
        {
            "id": 2,
            "label": "SIM",
            "action": "key-yes"
        },
        {
            "id": 3,
            "label": "NÃO",
            "action": "key-no"
        },
        {
            "id": 4,
            "label": "VIOLAR",
            "action": "key-rape"
        },
        {
            "id": 5,
            "label": "ROUBAR",
            "action": "key-assault"
        },
        {
            "id": 6,
            "label": "CONT.",
            "action": "key-continue"
        },
        {
            "id": 7,
            "label": "ENTRAR",
            "action": "key-enter"
        },
        {
            "id": 8,
            "label": "DEFESA",
            "action": "key-defend"
        }
          
    ],
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
                "cafe_action"
            ]
    },
    "balloons": {
        
        "empty": "empty",
        "hero_no_wallet": "hero_no_wallet",
        "hero_everything_fine": "hero_everything_fine",
        "hero_pussy": "hero_pussy",
        "hero_its_done": "hero_its_done",
        "hero_shit": "hero_shit",
        "hero_no_gun": "hero_no_gun",
        "hero_dont_have_gun": "hero_dont_have_gun",
        "hero_dont_smoke": "hero_dont_smoke",
        "hero_this_is_a_robbery": "hero_this_is_a_robbery",
        "hero_turn_around": "hero_turn_around",
        "police_ask_docs": "police_ask_docs",
        "police_come_with_me": "police_come_with_me",
        "police_ok_you_can_go": "police_ok_you_can_go",
        "police_how_its_going": "police_how_its_going",
        "whore_street_question01": "whore_street_question01",
        "whore_street_question02": "whore_street_question02",
        "whore_street_question03": "whore_street_question03",
        "whore_come_on_then": "whore_come_on_then",
        "oldlady_deserves100": "oldlady_deserves100",
        "oldlady_ho_my_god": "oldlady_ho_my_god",
        "oldlady_so_big": "oldlady_so_big",
        "oldlady_only_got_100": "oldlady_only_got_100",
        "oldlady_only_got_500": "oldlady_only_got_500",
        "thief_give_me_your_wallet": "thief_give_me_your_wallet",
        "thief_got_light": "thief_got_light",
        "thief_only_wanted_light": "thief_only_wanted_light"
    }
}   