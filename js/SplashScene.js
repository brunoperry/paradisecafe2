(function(window) {

    function SplashScene(data) {

        //OBJECT PROPERTIES
        var SCENE_SPEED = 500;
        var SCENE_TIME = 10;
        var SCENE_TIMEOUT = 0;

        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anim = sceneData.animations.background;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = sceneData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anim.length) {

                tick = 0;
            }

            context.drawImage(images[anim[tick]], 0, 0, canvasW, canvasH);

            SCENE_TIMEOUT++;
            if(SCENE_TIMEOUT >= SCENE_TIME) {

                changeScenes(mainScene.name);
                return;
            }
            tick++;
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bd0000";

            instance.isEnabled = true;
            setSpeed(SCENE_SPEED);
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
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.SplashScene = SplashScene;

}(window));