(function(window) {

    function Whore(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var whoreData = data;
        var images;
        var anims = whoreData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = whoreData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasAsked = false;
        this.action = "";
        this.power;
        this.cost;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle_street[0]];
        }

        this.idleBrothel = function () {

            instance.currentFrame = images[anims.idle_brothel[0]];
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.oral = function() {

            if(tick >= anims.oral.length) {

                tick = 0;
            }
            instance.currentFrame = images[anims.oral[tick]];

            tick++;
        }

        this.sex = function() {

            if(tick >= anims.sex.length) {

                tick = 0;
            }
            instance.currentFrame = images[anims.sex[tick]];

            tick++;
        }

        this.anal = function() {

            if(tick >= anims.anal.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.anal[tick]];
            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];

            instance.cost = Math.round(Utils.getRandomItem([500, 1000, 2000, 3000]));
            instance.power = Math.round(instance.cost / 15);
        }

        this.reset = function() {

            instance.disable();
            instance.enable();
        }
        

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasAsked = false;
            instance.cost = 0;
            instance.action = "";
            instance.currentFrame = images[anims.show[0]];
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(whoreData.images, imagesLoaded);
    }

    window.Whore = Whore;

}(window));