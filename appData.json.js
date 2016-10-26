var appData = {

    "scenes": [
        {
            "id": 0,
            "name": "main_scene",
            "images": ["main_bckgrd01", "main_bckgrd02"],
            "animations": [
                {
                    "background": [0, 1]
                }
            ]
        },
        {
            "id": 1,
            "name": "splash_scene",
            "images": ["splash_bckgrd01", "splash_bckgrd02", "splash_bckgrd03"],
            "animations": [
                {
                    "background": [0, 1, 0, 2]
                }
            ]
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
            "action": "key-highscores"
        }
    ]
}   