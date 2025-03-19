class NewScoreScene extends Scene {
  constructor(callback) {
    super(callback, NewScoreScene.NAME);

    this.view = document.querySelector("#new-score");
    this.input = this.view.querySelector("input");
  }

  update() {
    if (!Keyboard.isShown) {
      Keyboard.show([
        {
          text: Resources.labelsData.SAVE,
          action: Resources.labelsData.SAVE,
        },
        {
          text: Resources.labelsData.EXIT,
          action: Resources.labelsData.EXIT,
        },
      ]);
      Keyboard.onChange = (e) => {
        if (e === Resources.labelsData.SAVE) {
          if (this.input.value.length === 3) {
            Keyboard.hide();
            this.callback({
              action: NewScoreScene.ACTIONS.SAVE,
              name: this.input.value,
            });
          }
        } else {
          Keyboard.hide();
          this.callback({
            action: NewScoreScene.ACTIONS.EXIT,
          });
        }
      };
    }
  }
  async enable() {
    super.enable();
    this.view.style.display = "flex";
  }
  disable() {
    this.input.value = "";
    this.view.style.display = "none";
  }
}
NewScoreScene.NAME = "newscore";
NewScoreScene.ACTIONS = {
  SAVE: "newscoresceneactionssave",
  EXIT: "newscoresceneactionsexit",
};
