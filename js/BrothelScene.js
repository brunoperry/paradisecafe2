(function(window) {

    function BrothelScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;

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

            instance.currentFrame = Utils.mergeImages([
                images[anims.background[0]],
                whore.currentFrame,
                hero.currentFrame,
            ]);

            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;

            switch(action) {

                case "idle_action":
                doCurrentAction = idleAction;
                break;
                case "sex_action":
                doCurrentAction = sexAction;
                break;
                case "anal_action":
                doCurrentAction = analAction;
                break;
                case "oral_action":
                doCurrentAction = oralAction;
                break;
                case "pimp_action":
                doCurrentAction = pimpAction;
                break;
            }
        }

        var idleAction = function() {

            whore.idleBrothel();
            hero.idleBrothel();

        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bd00bd";

            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);
            audioSource.playClip(instance.id);

            hero.enable();
            whore.enable();

            changeAction("idle_action");
            instance.bill = 0;
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
            instance.bill = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.BrothelScene = BrothelScene;

}(window));