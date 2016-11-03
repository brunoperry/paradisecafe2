(function(window) {

    function OldLady(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var oldLadyData = data;
        var images;
        var anims = oldLadyData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = oldLadyData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
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
        

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(oldLadyData.images, imagesLoaded);
    }

    window.OldLady = OldLady;

}(window));