class JailScene extends Scene {

    constructor(callback) {
        super(callback, JailScene.NAME);
        this.bckgrdTick = 0;
    }

    update() {

        this.renderStack = [];
        this.blink = !this.blink;
        if (this.blink) {
            this.background.update()
        }
        this.renderStack = [this.background];
        if (!Keyboard.isShown) {
            Keyboard.show([
                {
                    text: Resources.labelsData.HOME,
                    action: Resources.labelsData.HOME
                },
                {
                    text: Resources.labelsData.HISCORES,
                    action: Resources.labelsData.HISCORES
                }
            ]);
            Keyboard.onChange = e => {
                Keyboard.hide();
                if (e === Resources.labelsData.HISCORES) this.callback(JailScene.Actions.HIGHSCORES);
                else this.callback(JailScene.Actions.HOME);
            }
        }
    }
}
JailScene.NAME = 'jail';
JailScene.Actions = {
    HIGHSCORES: 'jailsceneactionshighscores',
    HOME: 'jailsceneactionshighhome'
};