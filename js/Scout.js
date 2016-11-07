(function(window) {

    function Scout(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var scoutData = data;
        var images;
        var anims = scoutData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = scoutData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasSalute = false;
        this.hasStarted = false;
        this.isAction = false;
        this.isRobbed = false;


        var robValues = [100, 500, 10000, -1, 100, 500, -1, 100, 500, -1, 100, 500, -1, 100, 500, -1];

        this.pack = {
            value: -1,
            message: ""
        }

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

        this.salute = function() {

            if(tick >= anims.salute.length) {

                tick = 0;
                instance.hasSalute = true;
                return;
            }
            instance.currentFrame = images[anims.salute[tick]];

            tick++;
        }

        this.hideRobbed = function() {

            if(tick >= anims.hide_robbed.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide_robbed[tick]];

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

        this.idleRobbed = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.isAction = false;
            var val = Utils.getRandomItem(robValues);
            var str;
            if(val === -1) {
                str = "cookies";
            } else {
                str = val.toString();
            }
            instance.pack = {
                value: val,
                message: "scout_only_got_" + str
            }
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.isAction = false;
            instance.hasSalute = false;
            instance.isRobbed = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];

            instance.reset();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(scoutData.images, imagesLoaded);
    }

    window.Scout = Scout;

}(window));