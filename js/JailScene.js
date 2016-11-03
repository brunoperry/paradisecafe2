(function(window) {

    function JailScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var jailData = data;
        var images = jailData.images;
        var anim = jailData.animations.background;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = jailData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anim.length) {

                tick = 0;
            }
            instance.currentFrame = images[anim[tick]];
            render(instance.currentFrame);

            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);
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
        Utils.loadImages(jailData.images, imagesLoaded);
    }

    window.JailScene = JailScene;

}(window));