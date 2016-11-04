(function(window) {

    function ParadiseCafeScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var backgroundFrame;
        var backgroundInterval;

        //PUBLIC
        this.isEnabled = false;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.bill;
        this.showHUD = true;

        //ACTIONS STUFF
        var doCurrentAction;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();

            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;

            switch(action) {

                case "idle_action":
                doCurrentAction = idleAction;
                break;
            }
        }

        var idleAction = function() {

            hero.idleCafe();

            instance.currentFrame = Utils.mergeImages([
                backgroundFrame,
                hero.currentFrame,
            ]);
        }

        var updateBackground = function () {

            if(tick >= anims.background.length) {
                tick = 0;
            }

            backgroundFrame = images[anims.background[tick]];

            tick++;
        }

        this.enable = function() {

            document.body.style.backgroundColor = "black";

            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);
            audioSource.playClip(instance.id);

            changeAction("idle_action");

            backgroundInterval = setInterval(updateBackground, NORMAL_SPEED * 50);

            instance.bill = 20;
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
            backgroundInterval = clearInterval(backgroundInterval);
            backgroundInterval = null;

            instance.bill = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            backgroundFrame = images[anims.background[anims.background.length-1]];
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.ParadiseCafeScene = ParadiseCafeScene;

}(window));