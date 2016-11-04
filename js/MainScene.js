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
        this.name = sceneData.name;
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

            document.body.style.backgroundColor = "black";

            keyboard.show([
                appData.keys[0],
                appData.keys[1]], onKeyboardClick);

            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0
        }

        //EVENTS
        var onKeyboardClick = function(action) {

            switch(action) {

                //play action
                case appData.keys[0].action:

                changeScenes(streetScene.name);
                break;

                //scores action
                case appData.keys[1].action:

                d("show scores")

                break;
            }

            keyboard.hide();
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