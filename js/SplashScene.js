(function(window) {

    function SplashScene(data) {

        //OBJECT PROPERTIES
        var SCENE_SPEED = 500;
        var SCENE_TIME = 10;
        var SCENE_TIMEOUT = 0;

        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anim = sceneData.animations.background;
        var tick = 0;

        //IMAGE STUFF
        var loadCanvas;
        var loadContext;
        var WIDTH = document.getElementById("main-container").offsetWidth;
        var HEIGHT = document.getElementById("main-container").offsetHeight;
        var currentTime;
        var startTime;
        var yPos = 0;
        var vH;
        var LOAD_ANIM_TICK = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.showHUD = false;

        this.update = function() {

            if(!instance.isEnabled) return;
            if(tick >= anim.length) {
                tick = 0;
            }
            context.drawImage(images[anim[tick]], 0, 0, canvasW, canvasH);

            SCENE_TIMEOUT++;
            if(SCENE_TIMEOUT >= SCENE_TIME) {
                changeScenes(mainScene.name);
                return;
            }
            tick++;
        }

        var renderLoading = function(timestamp) {

            if(!instance.isEnabled) {
                return;
            };

            if(!startTime) {

                startTime = timestamp;
            }

            currentTime = timestamp - startTime;
            loadContext.fillStyle = "rgb(100, 0, 0)";
            loadContext.fillRect(0, 0, WIDTH, HEIGHT);

            if(currentTime < 597) {
                waitForDataAnim();

            } else if(currentTime >= 596 && currentTime < 4446) {
                loadHeadDataAnim();
            } else if(currentTime >= 4446){
                loadDataAnim();
            }
            window.requestAnimationFrame(renderLoading);
        }

        var waitForDataAnim = function() {

            var colIndex = 0;
            var colors = ["rgb(0, 255, 255)", "rgb(192, 0, 0)"];
            vH = 32;
            for(var i = 0; i < HEIGHT; i++) {

                if(colIndex >= colors.length) {
                    colIndex = 0;
                }
                
                loadContext.fillStyle = colors[colIndex];
                loadContext.fillRect(0, yPos, WIDTH, vH);
                if(yPos >= HEIGHT + 32) {
                    yPos = -64;
                    break;
                } else {
                    yPos += vH;
                    colIndex++;
                }
            }

            LOAD_ANIM_TICK++;
            if(LOAD_ANIM_TICK === 64 ){
                LOAD_ANIM_TICK = 0;
            }
            yPos += LOAD_ANIM_TICK;
        }

        var loadHeadDataAnim = function() {

            var colIndex = 0;
            var colors = ["rgb(255, 255, 0)", "rgb(0, 0, 255)"];
            var hs = [8, 16, 32, 32, 64];
            for(var i = 0; i < HEIGHT; i++) {

                vH = Utils.getRandomItem( hs );
                if(colIndex >= colors.length) {
                    colIndex = 0;
                }
                loadContext.fillStyle = colors[colIndex];
                loadContext.fillRect(0, yPos, WIDTH, vH);
                if(yPos >= HEIGHT) {
                    yPos = 0;
                    break;
                } else {
                    yPos += vH;
                    colIndex ++;
                }
            }
        }

        var loadDataAnim = function() {

            var colors = [  "rgb(0, 0, 0)",
                            "rgb(0, 0, 192)",
                            "rgb(192, 0, 0)", 
                            "rgb(192, 0, 192)",
                            "rgb(0, 0, 255)",
                            "rgb(255, 0, 0)",
                            "rgb(255, 0, 255)",
                            "rgb(0, 192, 0)",
                            "rgb(0, 192, 192)",
                            "rgb(192, 192, 0)",
                            "rgb(192, 192, 192)",
                            "rgb(0, 255, 0)",
                            "rgb(0, 255, 255)",
                            "rgb(255, 255, 0)",
                            "rgb(255, 255, 255)"
                            ];
            for(var i = 0; i < HEIGHT; i++) {
                vH = 4;
                loadContext.fillStyle = Utils.getRandomItem(colors);
                loadContext.fillRect(0, yPos, WIDTH, vH);
                if(yPos >= HEIGHT) {
                    yPos = 0;
                    break;
                } else {
                    yPos += vH;
                }
            }
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bd0000";
            audioSource.addListener(function(e) {

                instance.isReady = true;

                loadCanvas = document.createElement("canvas");
                loadContext = loadCanvas.getContext("2d");
                loadCanvas.width = WIDTH;
                loadCanvas.height = HEIGHT;
                loadCanvas.style.position = "absolute";
                loadCanvas.style.top = "0";
                loadCanvas.style.background = "black";

                document.getElementById("main-container").appendChild(loadCanvas);

                renderLoading();
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(SCENE_SPEED);

            instance.isEnabled = true;
        }

        this.disable = function() {
            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
            if(loadCanvas) {
                var c = document.getElementById("main-container");
                c.removeChild(c.childNodes[c.childNodes.length - 1]);
                loadCanvas = null;
            }
            currentTime = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.SplashScene = SplashScene;

}(window));