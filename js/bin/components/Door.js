class Door extends Component {
  constructor(callback) {
    super(callback, Door.NAME);

    this.cafeDoorImages = this.getImagesByName("door_cafe");

    this.doorScrollImage = this.getImagesByName("door_scroll.png");
    this.crackhouseScrollImage = this.getImagesByName("door_crackhouse_scroll");

    this.doorOpenImages = this.getImagesByName("door_open");
    this.doorCloseImages = [...this.doorOpenImages].reverse();
    this.crackhouseDoorOpenImages = this.getImagesByName("door_crackhouse_open");
    this.crackhouseDoorCloseImages = [...this.crackhouseDoorOpenImages].reverse();

    this.darkAlleyScrollImage = this.getImagesByName("door_darkalley_scroll");

    this.currentScrollImage = this.doorScrollImage;
    // this.currentScrollImage = this.darkAlleyScrollImage;

    this.isOpened = false;

    this.scrollTick = 0;

    this.actions = [
      Door.Actions.PARADISECAFE,
      Door.Actions.POLICE,
      Door.Actions.WHORE,
      Door.Actions.DARKALLEY,
      Door.Actions.THIEF,
      Door.Actions.SCOUT,
      Door.Actions.CRACKHOUSE,
      Door.Actions.OLD_LADY,
      Door.Actions.SCROLL,
    ];
    this.currentAction = Door.Actions.POLICE;
    // this.currentAction = Door.Actions.DARKALLEY;
  }

  doMove() {
    if (this.currentCycle !== this.currentScrollImage) {
      this.setCurrentCycle(this.currentScrollImage);
    }

    this.x = this.canvasW - this.scrollTick * 15;
    if (this.x < -this.width) {
      this.scrollTick = 0;
      this.currentAction = this.actions[Math.floor(Math.random() * this.actions.length)];

      switch (this.currentAction) {
        case Door.Actions.CRACKHOUSE:
          this.currentScrollImage = this.crackhouseScrollImage;
          break;
        case Door.Actions.DARKALLEY:
          this.currentScrollImage = this.darkAlleyScrollImage;
          break;
        default:
          this.currentScrollImage = this.doorScrollImage;
      }
    }
    this.scrollTick++;
  }
  doOpenDoor() {
    if (this.isOpened) return;
    this.x = 80;

    if (this.currentAction === Door.Actions.CRACKHOUSE) {
      if (this.currentCycle !== this.crackhouseDoorOpenImages) {
        this.setCurrentCycle(this.crackhouseDoorOpenImages, false);
      }
    } else {
      if (this.currentCycle !== this.doorOpenImages) {
        this.setCurrentCycle(this.doorOpenImages, false);
      }
    }

    if (this.tick === this.currentCycle.length - 1) this.isOpened = true;
  }
  doCloseDoor() {
    if (!this.isOpened) return;

    if (this.currentAction === Door.Actions.CRACKHOUSE) {
      if (this.currentCycle !== this.crackhouseDoorCloseImages) {
        this.setCurrentCycle(this.crackhouseDoorCloseImages, false);
      }
    } else {
      if (this.currentCycle !== this.doorCloseImages) {
        this.setCurrentCycle(this.doorCloseImages, false);
      }
    }

    if (this.tick === this.currentCycle.length - 1) this.isOpened = false;
  }
  doParadiseCafe() {
    if (this.currentCycle !== this.cafeDoorImages) {
      this.setCurrentCycle(this.cafeDoorImages);
    }
  }

  get hasAction() {
    if (this.x < 80 && this.x > 65) {
      const action = this.actions[Math.floor(Math.random() * this.actions.length)];
      if (action !== Door.Actions.SCROLL) return action;
    }
    return null;
  }

  disable() {
    super.disable();
    this.isOpened = false;
  }
}

Door.NAME = "door";
Door.Actions = {
  PARADISECAFE: "paradise_cafe",
  POLICE: "police",
  WHORE: "whore",
  THIEF: "thief",
  SCOUT: "scout",
  CRACKHOUSE: "crackhouse",
  OLD_LADY: "oldlady",
  SCROLL: "scroll",
  DARKALLEY: "darkalley",
};
