(function(window) {

    function Door(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var doorData = data;
        var images = doorData.images;
        var anims = doorData.animations;
        var tick = 0;

        //DOOR POSITION STUFF
        var scrollTick = 0;
        var doorW;
        var doorH;
        var doorX;
        var doorVCanvas = document.createElement("canvas");
        doorVCanvas.width = canvasW;
        doorVCanvas.height = canvasH;
        var doorCtx = doorVCanvas.getContext("2d");
        var doorImage = new Image();

        var cafeTick = 0;

        //EVENTS STUFF
        var callback;
        var doorAction;

        //PUBLIC
        this.isEnabled = false;
        this.name = doorData.name;
        this.currentFrame;

        this.isOpen = false;
        this.scrollLocked = true;
        this.isCafeDone = false;

        this.scroll = function() {

            if(!instance.isEnabled) return;

            doorX = (canvasW - scrollTick * 15) ;
            getImage(images[anims.scroll[0]]);
            instance.currentFrame = doorImage;

            if(doorX <= 80 && doorAction !== "street_action") {

                doorX = 80;

                callback(doorAction);
                return;
            }

            if(doorX <= -doorW) {

                reset();
            }
            scrollTick++;
        }

        this.showParadiseCafe = function() {

            if(cafeTick >= anims.show_cafe.length) {

                cafeTick = 0;
            }

            getImage(images[anims.show_cafe[cafeTick]]);
            instance.currentFrame = doorImage;

            cafeTick++;
        }

        this.open = function() {

            if(tick >= anims.open.length) {

                instance.isOpen = true;   
                tick = 0;
                return;
            }

            getImage(images[anims.open[tick]]);
            instance.currentFrame = doorImage;

            tick++;
        }

        this.idle = function() {

            getImage(images[anims.open[anims.open.length - 1]]);
            instance.currentFrame = doorImage;
        }

        this.close = function() {

            if(tick >= anims.close.length) {

                instance.isOpen = false;   
                tick = 0; 
                return;
            }

            getImage(images[anims.close[tick]])
            instance.currentFrame = doorImage;

            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            reset();
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
            scrollTick = 0;
        }

        this.setAction = function(action) {

            doorAction = action;
        }

        //Resets the door do initial position and new enemy to spawn
        var reset = function() {

            scrollTick = 0;
            
            var index = Math.floor(Math.random() * doorData.actions.length);
            doorAction = doorData.actions[index];
            // doorAction = "thief_action"
        }

        //get the image data from door
        var getImage = function(img) {

            doorCtx.drawImage(img, doorX, 0, doorW, canvasH);
            doorImage.src = doorVCanvas.toDataURL();
            doorCtx.clearRect(0, 0, canvasW, canvasH);
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            doorW = images[0].width;
            sceneReady();
        }

        this.addEventListener = function(listener) {

            callback = listener;
        }

        this.removeEventListener = function() {

            callback = null;
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(doorData.images, imagesLoaded);
    }

    window.Door = Door;

}(window));



