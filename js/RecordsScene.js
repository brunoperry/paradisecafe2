(function(window) {

    function RecordsScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;

        //SCROES CANVAS STUFF
        var recordsCanvas = document.createElement("canvas");
        recordsCanvas.width = canvasW;
        recordsCanvas.height = canvasH;
        var recordsCtx = recordsCanvas.getContext("2d");
        var recordsImage = new Image();

        //PUBLIC
        this.isEnabled = false;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.background.length) {

                tick = 0;
            }

            getImage(images[anims.background[tick]])
            instance.currentFrame = recordsImage;
            render(instance.currentFrame);

            tick++;
        }

        //get the image data from scene records
        var getImage = function(img) {

            recordsCtx.drawImage(img, 0, 0, canvasW, canvasH);
            recordsImage.src = recordsCanvas.toDataURL();
            recordsCtx.clearRect(0, 0, canvasW, canvasH);
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bdbd00";
            
            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);
            audioSource.playClip(mainScene.id);

            keyboard.show([
                appData.keys[9]

            ], function(e) {

                keyboard.hide();
                changeScenes(mainScene.name);
            });
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

    window.RecordsScene = RecordsScene;

}(window));