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
            instance.currentFrame = images[anims.show[0]];
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

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
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
            instance.action = "";
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