(function(window) {

    function RecordsScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var isRegister = false;

        var MAX_SCORES = 6;

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

        this.highestScore = 0;
        this.lowestScore = 0;

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
            listContext.fillText(labelsData.HUD.name, 55, 60);
            listContext.fillText(labelsData.HUD.score_simple, 165, 60);

            listContext.font = "24px Mono";
            listContext.fillStyle = "white";

            var offsetY = 10;
            var count = 0;
            if(scoresData.length > 0) {
                for(var i = 0; i < scoresData.length; i++) {
                    if(i > 0) {
                        listContext.fillStyle = "black";
                    }
                    listContext.fillText(scoresData[i].name, 55, 80 + (offsetY * i));
                    listContext.fillText(scoresData[i].score, 170, 80 + (offsetY * i));

                    if(i === 0) {
                        highestScore = parseInt(scoresData[i].score);
                    } else if( i === scoresData.length - 1) {
                        lowestScore = parseInt(scoresData[i].score);
                    }
                    count++;
                }
            }
            listContext.fillStyle = "black";
            if(scoresData.length < MAX_SCORES) {

                for(var i = count; i < MAX_SCORES; i++) {
                    listContext.fillText("---", 55, 80 + (offsetY * i));
                    listContext.fillText("------", 170, 80 + (offsetY * i));
                }
            }
            

            if(isRegister) {
                var text = listContext.measureText(labelsData.HUD.new_score);
                var x = Math.round((canvas.width / 2) - (text.width / 2));
                var y = Math.round(canvasH - 40);
                listContext.font = "24px Mono";
                listContext.fillStyle = "black";
                listContext.fillText(labelsData.HUD.new_score, x, y);

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
            if(scoresData.length < MAX_SCORES && hero.wallet.points > 0) {
                isRegister = true;
            } else {
                for(i = scoresData.length-1; i > -1; i--) {
                    if(hero.wallet.points > scoresData[i].score) {
                        isRegister = true;
                        break;
                    }
                }
            }   

            if(isRegister) {

                nameInput.style.display = "block";
                nameInput.focus();

                keyboard.show([
                    labelsData.keys[9],
                    labelsData.keys[10]
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
                    labelsData.keys[9]
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
                scoresData = [{
                    id: 0,
                    name: "tst",
                    score: 10000,
                    date_created: "23-ABR-2016"
                }];
                
                sceneReady();
            }
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.RecordsScene = RecordsScene;

}(window));