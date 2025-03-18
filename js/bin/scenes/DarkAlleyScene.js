class DarkAlleyScene extends Scene {
  #isSearching = false;
  #hasFound = false;
  #wasSnatched = false;

  #alleyEyes;
  constructor(callback) {
    super(callback, DarkAlleyScene.NAME);

    this.balloon = new Balloon();
    this.hero = new Hero();
    this.lightOff = this.lighting = Resources.getImage(
      `${CrackhouseScene.NAME}_light_off`
    );

    const eyeImages = Resources.getImages("darkalley_eyes");
    eyeImages.forEach((img) => {
      this.NPCs.push(new DarkAlleyEye(img));
    });

    // this.#alleyEyes = new DarkAlleyEyes();
    // this.#alleyEyes.eyes.forEach((eye) => {
    //   this.NPCs.push(eye.component);
    // });
  }

  doEntering() {
    if (this.hero.x >= 130) {
      this.hero.x = 130;
      this.changeAction(DarkAlleyScene.States.IDELING);
      return;
    }
    this.hero.moveTo(this.hero.x + 5);
    this.hero.doWalk();
  }
  doIdeling() {
    this.hero.doIdleStreet(2);

    if (!Keyboard.isShown) {
      if (!this.#hasFound) {
        Keyboard.show([
          {
            text: Resources.labelsData.SEARCH,
            action: Resources.labelsData.SEARCH,
          },
        ]);
        Keyboard.onChange = (e) => {
          if (e === Resources.labelsData.SEARCH) {
            this.hero.moveTo(0);
            this.changeAction(DarkAlleyScene.States.SEARCHING);
            Keyboard.hideExit();
          }
          Keyboard.hide();
        };
      }

      Keyboard.showExit((e) => {
        Keyboard.hide();
        Keyboard.hideExit();
        this.callback(DarkAlleyScene.States.EXITING);
      });
    }
  }
  doSearching() {
    if (this.#isSearching) return;
    this.hero.doSearchBin();
    this.#isSearching = true;
    setTimeout(() => {
      this.hero.x = 130;
      this.changeAction(DarkAlleyScene.States.IDELING);
      if (this.#wasSnatched) {
        this.balloon.doDialog([this.hero.getBalloon(this.#createFinding())]);
        this.hero.updateInventory({
          drugs: Utils.getRandomItem([2, 1, 4, 3, 2, 4, 1, 5]),
        });
      } else {
        this.balloon.doDialog([this.hero.getBalloon(this.#createFinding())]);
      }

      this.#hasFound = true;
    }, 5000);
  }
  doExiting() {}

  #createFinding() {
    const finding = Utils.getRandomItem(["40", "140", "180", "drugs", "200", "nothing"]);
    switch (finding) {
      case "40":
        this.hero.updateInventory({
          cash: 40,
        });
        break;
      case "140":
        this.hero.updateInventory({
          cash: 140,
        });
        break;
      case "180":
        this.hero.updateInventory({
          cash: 180,
        });
        break;
      case "200":
        this.hero.updateInventory({
          cash: 200,
        });
        break;
      case "drugs":
        this.hero.updateInventory({
          drugs: Utils.getRandomItem([2, 1, 4, 3, 2, 4, 1, 5]),
        });
        break;
      case "nothing":
        break;
    }

    return `found_${finding}`;
  }

  update(delta) {
    this.currentAction();

    this.hero.update();
    // this.#alleyEyes.update();
    super.update(delta);
  }

  changeAction(action) {
    switch (action) {
      case DarkAlleyScene.States.ENTERING:
        this.currentAction = this.doEntering;
        break;
      case DarkAlleyScene.States.IDELING:
        this.currentAction = this.doIdeling;
        break;
      case DarkAlleyScene.States.SEARCHING:
        this.currentAction = this.doSearching;
        break;
      case DarkAlleyScene.States.EXITING:
        this.currentAction = this.doExiting;
        break;
    }
  }

  enable() {
    super.enable();
    this.hero.enable();
    // this.#alleyEyes.enable();
    this.hero.x = -150;
    this.changeAction(DarkAlleyScene.States.ENTERING);
    HUD.hiScoresEnabled = true;
    this.#hasFound = false;
    this.#wasSnatched = false;
    this.#isSearching = false;
  }
  disable() {
    super.disable();
    this.hero.disable();
    this.currentAction = null;
    this.endAction = false;
  }
}

class DarkAlleyEye extends Component {
  constructor(img) {
    super(null);

    this.setCurrentCycle([img], false);
    this.enable();
    setTimeout(
      () => this.#update(),
      Utils.getRandomItem([1000, 2300, 3000, 2000, 4000, 5000, 2500, 1000, 5000, 4500])
    );
  }

  #update() {
    this.isEnabled ? this.disable() : this.enable();
    setTimeout(
      () => this.#update(),
      Utils.getRandomItem([1000, 2300, 3000, 2000, 4000, 5000, 2500, 1000, 5000, 4500])
    );
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

class DarkAlleyEyes {
  eyes = [];
  #times = [1000, 2300, 3000, 2000, 4000, 5000, 2500, 1000, 5000, 4500];
  constructor() {
    const images = Resources.getImages("darkalley_eyes");

    images.forEach((img, index) => {
      const comp = new Component(new Component(null, `eye${index}`));
      comp.setCurrentCycle([img], false);
      const eye = {
        component: comp,
        isEnabled: false,
      };
      //   setTimeout(() => this.#updateEye(eye), Utils.getRandomItem(this.#times));
      this.eyes.push(eye);
    });
  }

  //   #updateEye(eye) {
  // eye.isEnabled ? eye.disable() : eye.enable();
  // setTimeout(() => this.#updateEye(eye), Utils.getRandomItem(this.#times));
  //   }

  update() {
    // this.eyes.forEach((eye) => {
    //   if (eye.isEnabled) eye.component.update();
    // });
  }

  enable() {
    // this.eyes.forEach((eye) => {
    //   eye.component.enable();
    // });
  }
  disable() {
    // this.eyes.forEach((eye) => {
    //   eye.component.disable();
    // });
  }
}

DarkAlleyScene.States = {
  ENTERING: "darkalleyentering",
  IDELING: "darkalleyideling",
  SEARCHING: "darkalleysearching",
  EXITING: "darkalleyexiting",
};
DarkAlleyScene.NAME = "darkalley";
