(function(window) {

    function Pimp(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var pimpData = data;
        var images;
        var anims = pimpData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = pimpData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.isRaping = false;

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
            instance.currentFrame = images[anims.idle[0]];
        }

        this.rape = function() {

            if(tick >= anims.rape.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.rape[tick]];
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
            instance.hasStarted = false;
            instance.isAction = false;
            instance.isRaping = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(pimpData.images, imagesLoaded);
    }

    window.Pimp = Pimp;

}(window));