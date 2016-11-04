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

        this.isDone = false;
        this.isShown = false;
        this.isBended = false;
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

        this.bend = function() {

            if(tick >= anims.bend.length) {

                tick = 0;
                instance.isBended = true;
                return;
            }
            instance.currentFrame = images[anims.bend[tick]];

            tick++;
        }

        this.unbend = function() {

            if(tick >= anims.unbend.length) {

                tick = 0;
                instance.isBended = false;
                return;
            }
            instance.currentFrame = images[anims.unbend[tick]];

            tick++;
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
            instance.isBended = false;
            instance.action = "";
            tick = 0;
        }

        this.rob = function() {

            var val = Utils.getRandomItem([100, 500]);
            var msg = "oldlady_only_got_" + val;
            return {
                message: msg,
                value: val
            }
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(oldLadyData.images, imagesLoaded);
    }

    window.OldLady = OldLady;

}(window));