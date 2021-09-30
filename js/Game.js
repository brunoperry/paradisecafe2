class Game {

    constructor() {

        this.gameData = null;
        this.renderer = new Renderer(e => {
            console.log('renderer event', e)
        })
        this.audioSource = new AudioSource();

        this.menu = new Menu(async e => {

            switch (e) {
                case Menu.Actions.MUSIC_ON:
                    this.audioSource.mute();
                    break;
                case Menu.Actions.MUSIC_OFF:
                    this.audioSource.mute();
                    break;
                case Menu.Actions.NORMAL_SPEED:
                    this.setSpeed(Game.SPEED.NORMAL);
                    break;
                case Menu.Actions.TURBO_SPEED:
                    this.setSpeed(Game.SPEED.FAST);
                    break;
                case Menu.Actions.ABOUT:
                    window.open('https://brunoperry.net/games/paradisecafe/about', '_blank');
                    break;
                case Menu.Actions.EXIT:
                    this.pause();
                    this.audioSource.stop();
                    window.location = 'https://brunoperry.net/games';
                    break;
            }
        });

        this.currentState = Game.States.PAUSED;
        this.HUDUpdate = false;

        this.controller = new Controller(e => {
            if (this.menu.isOpen) {
                this.menu.close();
            } else {
                this.menu.open();
            }
        })
        this.isPlaying = false;
        this.isTransition = false;
    }

    init(data) {

        this.gameData = data;

        Resources.labelsData = this.gameData.labels;
        Loader.init();
        Keyboard.init();

        const landingScene = new LandingScene(async e => {

            this.pause();
            if (e === Resources.labelsData.YES) {
                this.startGame();
            } else {
                window.open(Resources.VERIFY_AGE_LINK, '_blank');
            }
        });

        this.intervalID = null;

        this.setSpeed(Game.SPEED.FAST);
        this.setScene(landingScene);

        this.run();
    }

    async startGame() {

        await Resources.init(this.gameData);
        HUD.init();
        Loader.clear();
        const splashScene = new SplashScene(e => {
            this.setSpeed(Game.SPEED.FAST);
            this.HUDUpdate = false;
            this.setScene(mainScene);
            this.controller.show();
        });
        const mainScene = new MainScene(e => {
            Resources.resetPlayerInventory();
            switch (e) {
                case Resources.labelsData.PLAY:
                    this.currentState = Game.States.PLAYING;
                    this.HUDUpdate = true;
                    this.setScene(streetScene, true);
                    break;
                case Resources.labelsData.HISCORES:
                    this.currentState = Game.States.SCORES;
                    this.HUDUpdate = false;
                    this.setScene(scoresScene, true);
                    break;
            }
        });
        const scoresScene = new ScoresScene(e => {
            this.HUDUpdate = false;
            this.currentState = Game.States.MAIN;
            this.setScene(mainScene, true);
        });
        const streetScene = new StreetScene(e => {
            this.HUDUpdate = true;
            switch (e) {
                case ParadiseCafeScene.NAME:
                    this.setScene(paradiseCafeScene, true);
                    break;
                case CrackhouseScene.NAME:
                    this.setScene(crackhouseScene, true);
                    break;
                case BrothelScene.NAME:
                    this.setScene(brothelScene, true);
                    break;
                case JailScene.NAME:
                    this.HUDUpdate = false;
                    this.setScene(jailScene, true);
                    break;

            }
        });
        const brothelScene = new BrothelScene(e => {
            this.HUDUpdate = true;
            this.setScene(streetScene, true);
        });
        const crackhouseScene = new CrackhouseScene(e => {
            this.HUDUpdate = true;
            if (e === CrackhouseScene.States.FAIL) {
                this.HUDUpdate = false;
                this.setScene(jailScene, true);
            }
            else {
                this.currentState = Game.States.PLAYING;
                this.setScene(streetScene, true);
            }
        });
        const paradiseCafeScene = new ParadiseCafeScene(e => {
            this.currentState = Game.States.PLAYING;
            this.HUDUpdate = true;
            if (e === JailScene.NAME) {
                this.HUDUpdate = false;
                this.setScene(jailScene, true)
            }
            else this.setScene(streetScene, true);
        });
        const jailScene = new JailScene(e => {

            this.HUDUpdate = false;
            if (Utils.checkTopFive(Resources.scoresData, Resources.PLAYER_INVENTORY.points)) {
                this.setScene(newScoreScene);
            } else {
                switch (e) {
                    case JailScene.Actions.HIGHSCORES:
                        this.currentState = Game.States.SCORES;
                        this.setScene(scoresScene, true);
                        break;
                    case JailScene.Actions.HOME:
                        this.setScene(mainScene, true);
                        break;
                    default:
                        break;
                }
            }
        });
        const newScoreScene = new NewScoreScene(async e => {
            if (e.action === NewScoreScene.ACTIONS.SAVE) {
                const res = await fetch('data', {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify({
                        name: e.name,
                        score: '' + Resources.PLAYER_INVENTORY.points
                    })
                });
                await res.json();
            } else {
                this.setScene(mainScene);
            }
        });

        this.setSpeed(Game.SPEED.SLOW);
        this.setScene(splashScene);

        this.currentState = Game.States.PLAYING;
        this.run();
    }

    async setScene(scene, doTransition = false) {

        if (doTransition) {

            this.pause();

            this.isTransition = true;
            Utils.transition(this.renderer.ctx, this.renderer.canvas, async () => {
                this.isTransition = false;

                this.currentScene.disable();
                this.currentScene = scene;
                this.currentScene.enable();
                await this.audioSource.play(this.currentScene.music);

                this.run();
            });

            return
        }

        if (this.currentScene) this.currentScene.disable();
        this.currentScene = scene;
        this.currentScene.enable();

        await this.audioSource.play(this.currentScene.music);
    }
    setSpeed(speed) {
        Game.CURRENT_SPEED = speed;
        if (this.intervalID) {
            this.pause();
            this.run();
        }
    }

    run() {
        if (this.intervalID || this.isTransition) return;

        let tick = 0;
        this.intervalID = setInterval(() => {

            if (this.menu.isOpen) return;

            this.currentScene.update(tick);
            switch (this.currentState) {
                case Game.States.PLAYING:
                    this.renderer.render(this.currentScene.renderStack);
                    if (this.HUDUpdate) HUD.update(Resources.PLAYER_INVENTORY);
                    break;
                case Game.States.PAUSED:

                    break;
                case Game.States.MAIN:
                    this.renderer.render(this.currentScene.renderStack);
                    break;
            }
            tick++;
        }, Game.CURRENT_SPEED);
    }
    pause() {
        if (!this.intervalID) return;
        clearInterval(this.intervalID);
        this.intervalID = null;
    }
}

Game.States = {
    MAIN: 'gamestatemain',
    PAUSED: 'gamestatepaused',
    PLAYING: 'gamestateplaying',
    ENDED: 'gamestateended',
    SCORES: 'gamestatescores'
}

Game.SPEED = {
    SLOW: 350,
    NORMAL: 150,
    FAST: 50
}

Game.CURRENT_SPEED = Game.SPEED.NORMAL;

Game.Events = {
    INITIALIZED: 'gameeventinitialized'
}