(function(window) {

    function MainScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anim = sceneData.animations.background;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.showHUD = false;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anim.length) {

                tick = 0;
            }
            instance.currentFrame = [images[anim[tick]]];
            render(instance.currentFrame);

            tick++;
        }

        this.enable = function() {

            keyboard.show([
                appData.keys[0],
                appData.keys[1]], onKeyboardClick);

            instance.isEnabled = true;

            //reset hero for a new game
            hero.reset();

            sideMenu.enable();

            audioSource.addListener(function(e) {
                document.body.style.backgroundColor = "black";
                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0
        }

        //EVENTS
        var onKeyboardClick = function(action) {

            keyboard.hide();

            switch(action) {

                //play action
                case appData.keys[0].action:

                changeScenes(streetScene.name);
                break;

                //scores action
                case appData.keys[1].action:

                changeScenes(recordsScene.name);

                break;
            }
        }

        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.MainScene = MainScene;

}(window));