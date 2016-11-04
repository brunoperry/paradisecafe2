(function(window) {

    function Police(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var policeData = data;
        var images;
        var anims = policeData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = policeData.name;
        this.currentFrame;

        this.isShown = false;
        this.isAgressive = false;
        this.hasAsked = false;
        this.isDone = false;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                instance.isAgressive = Math.random() < 0.5;
                // instance.isAgressive = true;

                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.show[0]];
        }

        this.action = function() {
            instance.currentFrame = images[anims.action[0]];
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
        

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
            instance.isShown = false;
            instance.hasAsked = false;
            instance.isDone = false;
        }

        this.reset = function (){

            instance.disable();
            instance.enable();
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(policeData.images, imagesLoaded);
    }

    window.Police = Police;

}(window));