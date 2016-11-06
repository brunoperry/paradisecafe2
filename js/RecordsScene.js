(function(window) {

    function RecordsScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var isRegister = false;

        var listCanvas = document.getElementById("virtual-canvas");
        var listContext = listCanvas.getContext("2d");
        var nameInput = document.getElementById("name-input");
        nameInput.addEventListener("input", function(e) {
            paintList();
        });

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = false;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;

        //LIST
        var listImage = new Image();

        var scoresData;

        this.update = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.background.length) {

                tick = 0;
            }

            instance.currentFrame = [images[anims.background[tick]], listImage];
            render(instance.currentFrame);

            tick++;
        }

        var paintList = function() {

            listContext.clearRect(0, 0, canvasW, canvasH);
            listContext.font = "28px Mono";
            listContext.fillStyle = "black";
            listContext.fillText("HI-SCORES", 80, 40);
            listContext.font = "20px Mono";
            listContext.fillText("Nome", 55, 60);
            listContext.fillText("Score", 165, 60);

            listContext.font = "24px Mono";
            listContext.fillStyle = "white";

            var offsetY = 10;
            for(var i = 0; i < scoresData.length; i++) {

                if(i > 0) {
                    listContext.fillStyle = "black";
                }
                listContext.fillText(scoresData[i].name, 55, 80 + (offsetY * i));
                listContext.fillText(scoresData[i].score, 170, 80 + (offsetY * i));
            }

            if(isRegister) {
                var text = listContext.measureText("NOVO HI-SCORE!");
                var x = Math.round((canvas.width / 2) - (text.width / 2));
                var y = Math.round(canvasH - 40);
                listContext.font = "24px Mono";
                listContext.fillStyle = "black";
                listContext.fillText("NOVO HI-SCORE!", x, y);

                text = listContext.measureText(hero.wallet.points.toString());
                x = Math.round((canvas.width / 2) - (text.width / 2));
                y = Math.round(canvasH - 27);
                listContext.font = "28px Mono";
                listContext.fillStyle = "white";
                listContext.fillText(hero.wallet.points.toString(), x, y);
            }
            listImage.src = listCanvas.toDataURL();
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bdbd00";
            
            instance.isEnabled = true;
            instance.isReady = true;

            audioSource.playClip(mainScene.id);
            setSpeed(NORMAL_SPEED);

            isRegister = false;
            for(i = scoresData.length-1; i > -1; i--) {

                if(hero.wallet.points > scoresData[i].score) {
                    isRegister = true;
                    break;
                }
            }
            // isRegister = true;

            if(isRegister) {

                nameInput.style.display = "block";
                nameInput.focus();

                keyboard.show([
                    appData.keys[9],
                    appData.keys[10]
                ], function(e) {

                    if(e === "key-register") {

                        if(nameInput.value.length === 0) return;
                        registerNewscore();
                    } else {

                        keyboard.hide();
                        changeScenes(mainScene.name);
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

            paintList();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            isRegister = false;
            nameInput.style.display = "none";
            tick = 0
        }

        var registerNewscore = function() {

            Utils.setScore("api.php?insert=set&name=" + nameInput.value.toUpperCase() + "&score=" + hero.wallet.points, function(data) {
            
                keyboard.hide();
                scoresData = JSON.parse(data);
                hero.reset();
                instance.disable();
                instance.enable();
            });
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;

            if(!DEBUG) {

                Utils.getScores("api.php?action=scores", function(data) {
                    scoresData = JSON.parse(data);
                    sceneReady();
                });
            } else {
                sceneReady();
            }
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.RecordsScene = RecordsScene;

}(window));