(function(window) {

    function TemplateScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = sceneData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;

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
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.TemplateScene = TemplateScene;

}(window));