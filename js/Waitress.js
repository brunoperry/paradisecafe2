(function(window) {

    function Waitress(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var waitressData = data;
        var images;
        var anims = waitressData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = waitressData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.hasServed = false;
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

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                instance.isDone = true;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.serve = function() {

            if(tick >= anims.serve.length) {

                tick = 0;
                instance.hasServed = true;
                return;
            }
            instance.currentFrame = images[anims.serve[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.isDone = false;
            instance.cost = Utils.getRandomItem([100, 200, 450]);
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.hasServed = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(waitressData.images, imagesLoaded);
    }

    window.Waitress = Waitress;

}(window));