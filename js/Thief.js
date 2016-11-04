(function(window) {

    function Thief(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var thiefData = data;
        var images;
        var anims = thiefData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = thiefData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.isBended = false;
        this.hasPulledCigar = false;
        this.action = "";
        this.isAggressive;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                instance.isAgressive = Math.random() < 0.5;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.show[anims.show.length - 1]];
        }

        this.showGun = function() {

            instance.currentFrame = images[anims.gun[0]];
        }

        this.pullCigar = function() {

            if(tick >= anims.pull_cigar.length) {

                tick = 0;
                instance.hasPulledCigar = true;
                return;
            }
            instance.currentFrame = images[anims.pull_cigar[tick]];

            tick++;
        }

        this.unpullCigar = function() {

            if(tick >= anims.unpull_cigar.length) {

                tick = 0;
                instance.hasPulledCigar = false;
                return;
            }
            instance.currentFrame = images[anims.unpull_cigar[tick]];

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
            instance.hasPulledCigar = false;
            instance.action = "";
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(thiefData.images, imagesLoaded);
    }

    window.Thief = Thief;

}(window));