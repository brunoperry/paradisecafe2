(function(window) {

    function RecordsScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.background.length) {

                tick = 0;
            }

            instance.currentFrame = [images[anims.background[tick]]];
            render(instance.currentFrame);

            tick++;
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bdbd00";
            
            instance.isEnabled = true;
            instance.isReady = true;

            audioSource.playClip(mainScene.id);
            setSpeed(NORMAL_SPEED);

            keyboard.show([
                appData.keys[9]

            ], function(e) {

                keyboard.hide();
                changeScenes(mainScene.name);
            });
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

    window.RecordsScene = RecordsScene;

}(window));