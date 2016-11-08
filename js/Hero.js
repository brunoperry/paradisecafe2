(function(window) {

    function Hero(data) {

        //OBJECT PROPERTIES
        var INITIAL_CASH = 30000;
        var instance = this;
        var heroData = data;
        var images;
        var anims = heroData.animations;
        var tick = 0;
        var SEX_TIMEOUT = Math.round((NORMAL_SPEED / 3) * 1.50);
        this.SEX_TICK = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = heroData.name;
        this.currentFrame;

        //HERO PROPERTIES
        this.wallet = {
            isStolen: false,
            hasGun: false,
            cash: INITIAL_CASH,
            points: 0,
            drugs: 0
        }

        this.hasShownDocs = false;
        this.hasEnteredBrothel = false;
        this.hasRaped = false;
        this.hasRobbed = false;
        this.hasFucked = false;
        this.isFucking = false;
        this.isDefending = false;
        this.hasDrink = false;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.drink = function() {

            if(tick >= anims.drink.length) {

                instance.hasDrink = false;
                tick = 0;
                return;
            }
            instance.currentFrame = images[anims.drink[tick]];
            tick++;
        }

        this.rapeOldLady = function () {

            if(instance.SEX_TICK === SEX_TIMEOUT) {

                instance.hasRaped = true;
                return;
            }

            if(instance.SEX_TICK <= (anims.undress.length-1)) {

                instance.currentFrame = images[anims.undress[instance.SEX_TICK]];

            } else if(instance.SEX_TICK >= (SEX_TIMEOUT - (anims.dress.length-1))) {

                if(instance.SEX_TICK === (SEX_TIMEOUT - (anims.dress.length-1))) {
                    tick = 0;
                }

                instance.currentFrame = images[anims.dress[tick]];
                tick++;
            } else {

                if(tick >= anims.rape.length) {

                    tick = 0;
                }
                instance.currentFrame = images[anims.rape[tick]];
                tick++;
            }

            instance.SEX_TICK++;
        }

        this.bend = function() {

            instance.currentFrame = images[anims.bend[0]];
        }

        this.oral = function() {

            if(tick >= anims.oral.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.oral[tick]];
            tick++;
            instance.SEX_TICK++;
        }

        this.anal = function() {

            if(tick >= anims.anal.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.anal[tick]];
            tick++;
        }

        this.sex = function() {

            if(tick >= anims.sex.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.sex[tick]];
            tick++;
            instance.SEX_TICK++;
        }

        this.walk = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.walk.length) {

                tick = 0;

            }

            instance.currentFrame = images[anims.walk[tick]];

            tick++;
        }

        this.robScout = function() {

            if(tick >= anims.rob_scout.length) {

                instance.hasRobbed = true;
                tick = 0;
                return;
            }
            instance.currentFrame = images[anims.rob_scout[tick]];

            tick++;
        }

        this.idleStreet = function(look) {

            if(look === "left") {
                instance.currentFrame = images[anims.street_idle_left[0]];

            } else if(look === "right") {
                instance.currentFrame = images[anims.street_idle_right[0]];

            } else {
                instance.currentFrame = images[anims.street_idle_front[0]];
            }
        }

        this.idleGun = function() {

            instance.currentFrame = images[anims.gun_idle[0]];
        }

        this.idleCafe = function() {

            instance.currentFrame = images[anims.cafe_idle[0]];
        }

        this.showDocs = function() {

            instance.currentFrame = images[anims.show_docs[0]];
        }

        this.enterBrothel = function() {

            if(tick >= anims.enter_building.length) {

                instance.hasEnteredBrothel = true;
                tick = 0;
                return;
            }

            instance.currentFrame = images[anims.enter_building[tick]];

            tick++;
        }

        this.idleBrothel = function() {

            instance.currentFrame = images[anims.brothel_idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0
        }

        this.resetTick = function() {
            tick = 0;
        }

        this.reset = function() {

            instance.disable();
            instance.wallet.isStolen =  false;
            instance.wallet.hasGun =  false;
            instance.wallet.cash =  INITIAL_CASH;
            instance.wallet.points =  0;
            instance.wallet.drugs =  0;
            instance.hasShownDocs = false;
            instance.hasEnteredBrothel = false;
            instance.hasRaped = false;
            instance.hasRobbed = false;
            instance.isFucking = false;
            instance.hasFucked = false;
            instance.isDefending = false;
            instance.hasDrink = false;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(heroData.images, imagesLoaded);
    }

    window.Hero = Hero;

}(window));