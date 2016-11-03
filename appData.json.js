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
                    "hero_show_docs"
                ],
            "animations":
            {
                "street_idle_left": [0],
                "street_idle_front": [1],
                "street_idle_right": [2],
                "walk": [3, 4, 5, 6],
                "show_docs": [7]
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
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
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
        }
          
    ],
    "door":
    {
        "id": 0,
        "name": "door",
        "images": ["door_scroll", "door_open01", "door_open02"],
        "animations":
        {
            "scroll": [0],
            "open": [0, 1, 2],
            "close": [2, 1, 0]
        },
        "actions": 
            [
                "street_action",
                "police_action",
                "whore_action",
                // "thief_action",
                // "oldlady_action"
            ]
    },
    "balloons": {
        
        "empty": "empty",
        "hero_no_wallet": "hero_no_wallet",
        "hero_everything_fine": "hero_everything_fine",
        "hero_pussy": "hero_pussy",
        "police_ask_docs": "police_ask_docs",
        "police_come_with_me": "police_come_with_me",
        "police_ok_you_can_go": "police_ok_you_can_go",
        "police_how_its_going": "police_how_its_going",
        "whore_street_question01": "whore_street_question01",
        "whore_street_question02": "whore_street_question02",
        "whore_street_question03": "whore_street_question03",
        "whore_come_on_then": "whore_come_on_then"
    }
}   