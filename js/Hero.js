(function(window) {

    function Hero(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var heroData = data;
        var images;
        var anims = heroData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = heroData.name;
        this.currentFrame;

        //HERO PROPERTIES
        this.wallet = {
            isStolen: false,
            hasGun: false,
            cash: 1000,
            points: 0
        }

        this.hasShownDocs = false;

        this.update = function() {

            if(!instance.isEnabled) return;

        }

        this.walk = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.walk.length) {

                tick = 0;

            }

            instance.currentFrame = images[anims.walk[tick]];

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

        this.showDocs = function() {

            instance.currentFrame = images[anims.show_docs[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0
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