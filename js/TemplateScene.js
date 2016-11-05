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
        this.isReady = false;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.showHUD = true;

        this.update = function() {

            if(!instance.isEnabled) return;

        }

        this.enable = function() {

            instance.isEnabled = true;

            audioSource.playClip(instance.id);
            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            setSpeed(NORMAL_SPEED);
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
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