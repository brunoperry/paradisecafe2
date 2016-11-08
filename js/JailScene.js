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
        this.isReady = false;
        this.doTransition = true;
        this.id = jailData.id;
        this.name = jailData.name;
        this.currentFrame;

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

            document.body.style.backgroundColor = "black";

            instance.isEnabled = true;

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            if(hero.wallet.points > 0 && hero.wallet.points >= recordsScene.lowestScore) {
                keyboard.show([
                    appData.keys[9],
                    appData.keys[10]
                ], function(e) {
                    keyboard.hide();
                    if(e === "key-restart") {
                        changeScenes(mainScene.name);
                    } else {
                        changeScenes(recordsScene.name);
                    }
                });
            } else {
                keyboard.show([
                    appData.keys[9]
                ], function(e) {
                    keyboard.hide();
                    changeScenes(mainScene.name);
                });
            }
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
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