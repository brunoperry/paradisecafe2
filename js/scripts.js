/**
 * UTILS START
 */
(function(window) {

    function Utils() {};

    Utils.getAPI = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('GET', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }

    Utils.loadImages = function(dataIn, callback) {

        var totalImages = 0;
        var dataOut = [];
        for(var i = 0; i < dataIn.length; i++) {
            dataOut[i] = new Image();
            dataOut[i].crossOrigin = "anonymous";
            dataOut[i].onload = function() { 
                totalImages++;
                if(totalImages === dataIn.length && callback) {
                    callback(dataOut);
                }
            }
            dataOut[i].src = "media/images/" + dataIn[i] + ".png";
        }
    };

    Utils.getBalloonImage = function(dataIn, callback) {

        var totalImages = Object.keys(dataIn).length;
        var imagesLoaded = 0;
        var dataOut = [];

        for(var balloon in dataIn) {

            if (dataIn.hasOwnProperty(balloon)) {

                dataOut[balloon] = new Image();
                dataOut[balloon].onload = function() {
                    imagesLoaded++;
                    if(imagesLoaded === totalImages) {
                        callback(dataOut);
                    }
                }
                dataOut[balloon].src = "media/images/balloons_" + dataIn[balloon] + ".png";
            }
        }
    }

    Utils.getRandomItem = function(data) {

        return data[Math.floor(Math.random() * data.length)];
    }

    Utils.mergeImages = function(images) {

        var img = new Image();

        for(var i = 0; i < images.length; i++) {
            vContext.drawImage(images[i], 0, 0, canvasW, canvasH);
        }

        img.src = vCanvas.toDataURL();
        return img;
    }

    Utils.getScores = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('GET', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }
    Utils.setScore = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('POST', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }
    window.Utils = Utils;

} (window));
/**
 * ############################################ UTILS END
 */

/**
 * AUDIOSOURCE START
 */
(function(window) {

    function AudioSource() {

        var instance = this;
        var player = document.getElementById("audio-player");
        var clips = [];
        var currentAudio;
        var loadedCallback = null;

        var isOff = false;
        this.isEnabled = true;

        var init = function() {
            var srcs = player.getElementsByTagName("source");
            for(var i = 0; i < srcs.length; i++) {
                clips.push(srcs[i].src);
            }
            player.preload = "auto";
        }

        this.onAudioCanPlayThrough = function(e) {
            if(loadedCallback) {
                loadedCallback();
            }
        }

        this.addListener = function(listener) {
            loadedCallback = listener;
        }

        this.setVolume = function(vol) {
            player.volume = vol;
        }

        this.enable = function() {
            if(isOff) {
                player.pause();
                player.src = currentAudio;
                player.play();
            }
            isOff = false;
            instance.isEnabled = true;
        }

        this.disable = function() {
            isOff = true;
            player.pause();
            instance.isEnabled = false;
        }

        this.getSourceFromSceneID = function(sceneID) {
            return clips[sceneID];
        }

        this.playClip = function(sceneID) {
            currentAudio = clips[sceneID];
            if(isOff) {
                if(loadedCallback) {
                    loadedCallback();
                }
                return;
            }
            if(!player.paused && player.src !== currentAudio) {
                player.pause();
            }
            if(player.src !== currentAudio) {
                player.src = currentAudio;
                player.play();
            } else if(loadedCallback) {
                loadedCallback();
            }
        }
        init();
    }

    window.AudioSource = AudioSource;

}(window));
/**
 * ############################################ AUDIOSOURCE END
 */

/**
 * KEYBOARD START
 */
(function(window) {

    function Keyboard() {

        //OBJECT PROPERTIES
        var instance = this;
        var callback;
        var permCallback;
        var keysContainer = document.getElementById("keys-container");
        var permKeyContainer = document.getElementById("perm-key-container");
        var keys;

        this.isVisible = false;

        var timeout;

        //OBJECT METHODS
        //build keys
        var buildKeys = function(data, container) {

            container.innerHTML = "";

            var key;
            var label;
            for(var i = 0; i < data.length; i++) {

                key = document.createElement("div");
                key.className = "keyboard-key";
                key.dataset.action = data[i].action;

                label = document.createElement("label");
                label.innerHTML = data[i].label;
                key.appendChild(label);

                container.appendChild(key);
            }

            keys = container.getElementsByClassName("keyboard-key");
            for(var i = 0; i < keys.length; i++) {
                keys[i].addEventListener("click", onKeyClick);
            }
        }

        //key click event
        var onKeyClick = function(e) {

            if(!callback) {
                permCallback(e.target.dataset.action);
            } else {
                callback(e.target.dataset.action);
            }
        }

        this.disablePermKey = function() {

            permKeyContainer.className = "disabled";
        }

        this.enablePermKey = function() {

            permKeyContainer.className = "";
        }

        //PUBLIC
        this.showPerm = function(data, icallback) {

            permCallback = icallback;

            //build key
            buildKeys(data, permKeyContainer);

            document.getElementById("keyboard-container").className = "slide-in";
        }
        this.hidePerm = function() {

            permKeyContainer.innerHTML = "";
            permCallback = null;
        }
        this.show = function(data, icallback) {

            callback = icallback;

            //build keys
            buildKeys(data, keysContainer);

            document.getElementById("keyboard-container").className = "slide-in";

            instance.isVisible = true;
        }

        this.showTimedout = function(data, tO, icallback) {

            callback = icallback;

            buildKeys(data, keysContainer);

            var cont = document.getElementById("keyboard-container");
            cont.className = "slide-in";

            instance.isVisible = true;

            var tick = tO;
            var btnLabel = cont.getElementsByClassName("keyboard-key")[0].getElementsByTagName("label")[0];
            var label = btnLabel.innerHTML;
            btnLabel.innerHTML = label + " " + tick.toString();
            timeout = setInterval(function() {

                tick--;

                if(tick === -1) {

                    clearInterval(timeout);
                    timeout = null;

                    callback("fail");  
                    return; 
                };
                btnLabel.innerHTML = label + " " + tick.toString();
            }, tO * 200);
        }

        this.hide = function() {

            if(!instance.isVisible) return;

            callback = null;
            document.getElementById("keyboard-container").className = "";

            for(var i = 0; i < keys.length; i++) {

                keys[i].removeEventListener("click", onKeyClick);
            }
            keysContainer.innerHTML = "";
            keys = null;
            instance.isVisible = false;

            if(timeout) {

                clearInterval(timeout);
                timeout = null;
            }
        }
    }

    window.Keyboard = Keyboard;

}(window));
/**
 * ############################################ KEYBOARD END
 */

/**
 * SIDEMENU START
 */
(function(window) {

    function SideMenu() {

        var instance = this;
        var container = document.getElementById("side-menu-container");
        var btns = container.getElementsByClassName("side-menu-item");
        var hamburgerBtn = document.getElementById("menu-button");
        var isOpened = false;

        var currentSpeedButton;

        var isVisible = false;

        var init = function() {

            //HAMBURGER BUTTON EVENT SETUP
            hamburgerBtn.addEventListener("click", openClose);

            //LIST BUTTONS EVENT SETUP
            for(var i = 0; i < btns.length; i++) {

                btns[i].addEventListener("click", onMenuClick);
            }

            var sc = document.getElementById("speed-container").getElementsByClassName("side-menu-item");
            for(var i = 0; i < sc.length; i++) {

                if(sc[i].innerHTML.search("[X]") !== -1) {
                    currentSpeedButton = sc[i];
                    return;
                }   
            }
        }

        var openClose = function() {

            isOpened = !isOpened;

            if(isOpened) {
                setSpeed(0);
                container.className = "slide-in";
            } else {

                setSpeed(NORMAL_SPEED);
                container.className = "";
            }

            if(audioSource.isEnabled) {

                if(isOpened) {
                    audioSource.setVolume(0.2);
                } else {
                    audioSource.setVolume(1.0);
                }
            }
        }

        var onMenuClick = function(e) {

            switch(e.target.dataset.action) {

                case "mute":
                if(audioSource.isEnabled) {
                    audioSource.disable();
                    e.target.innerHTML = e.target.innerHTML.replace("[X]", "[ ]");
                } else {
                    audioSource.enable();
                    e.target.innerHTML = e.target.innerHTML.replace("[ ]", "[X]");
                }
                
                break;

                case "exit":
                    changeScenes(mainScene.name);
                break;

                case "about":
                    window.open(root + "about.html", "_blank");
                break;

                case "slow":
                case "normal":
                case "turbo":

                currentSpeedButton.innerHTML = currentSpeedButton.innerHTML.replace("[X]", "[ ]");
                currentSpeedButton = e.target;
                currentSpeedButton.innerHTML = currentSpeedButton.innerHTML.replace("[ ]", "[X]");
                NORMAL_SPEED = parseFloat(currentSpeedButton.dataset.value);
                SPEED = NORMAL_SPEED;
                balloon.setSpeed(e.target.dataset.action);

                break;
            }

            hamburgerBtn.click();
        }

        this.enable = function() {

            if(isVisible) return;

            hamburgerBtn.style.display = "block";
            isVisible = true;
        }

        this.disable = function() {

            if(!isVisible) return;

            hamburgerBtn.style.display = "none";
            isVisible = false;
        }

        init();
    }

    window.SideMenu = SideMenu;


}(window));
/**
 * ############################################ SIDEMENU END
 */

/**
 * BALLOON START
 */
(function(window) {

    function Balloon(data) {

        var BALLOON_TIMEOUT = 2000;

        var instance = this;
        var balloonsData = data;
        var images;

        var timeout;

        this.isShowing = false;
        var isDialog = false;
        this.doneDialog = false;

        this.currentFrame;

        this.justShowBalloon = function(balloon, callback) {

            instance.currentFrame = images[balloon];
            instance.isShowing = true;
                
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            timeout = setTimeout( function() {
                
                if(callback) callback();
                instance.justHideBalloon();
            }, BALLOON_TIMEOUT);
        }

        this.clearBalloon = function() {

            instance.currentFrame = images.empty;
        }

        this.setSpeed = function(speed) {

            var val = 2000;
            switch(speed) {
                case "slow":
                val = 2000;
                break;
                case "normal":
                val = 1700;
                break;
                case "turbo":
                val = 1000;
                break;
            }
            BALLOON_TIMEOUT = val;
        }
        
        this.showBalloon = function(balloon, callback, keep) {

            instance.currentFrame = images[balloon];

            setSpeed(0);
            instance.isShowing = true;
                
            if(timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            if(callback) {
                
                timeout = setTimeout( function() {
                    
                    instance.hideBalloon();
                    callback();
                }, BALLOON_TIMEOUT);

            } else {

                if(!keep) timeout = setTimeout( instance.hideBalloon, BALLOON_TIMEOUT);
            }

            instance.isDialog = false;
        };

        this.showDialog = function(balloons) {

            if(isDialog) return;

            isDialog = true;
            instance.isShowing = true;

            var vInstance = this;
            vInstance.i = 0;
            var dialog = function() {

                instance.currentFrame = images[balloons[vInstance.i]];

                if(timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                setTimeout(function() {

                    if(vInstance.i < balloons.length) {

                        dialog();
                    } else {

                        isDialog = false;
                        instance.doneDialog = true;
                    }
                    
                }, BALLOON_TIMEOUT);
                vInstance.i++;
            }
            dialog();
        }

        this.justHideBalloon = function() {

            instance.isShowing = false;
            instance.currentFrame = images.empty;
        }

        this.hideBalloon = function() {

            if(!instance.isShowing) return;

            instance.isShowing = false;
            isDialog = false;
            setSpeed(NORMAL_SPEED);

            instance.currentFrame = images.empty;
        }

        this.pause = function() {

            clearTimeout(timeout);
            timeout = null;
        }

        /**
         * GETS THE IMAGES FROM SPECIFIC OBJECT
         */
        this.getData = function(from) {

            var imgs = [];
            for(b in images) {
                if(b.toString().includes(from)) {
                    imgs.push(b);
                }
            }
            return imgs;
        }

        this.resume = function() {

            if(instance.isShowing) {
                timeout = setTimeout( instance.hideBalloon, BALLOON_TIMEOUT);
            }
        }

        var imagesReady = function(data) {
            images = data;
            instance.currentFrame = images.empty;
        }

        Utils.getBalloonImage(balloonsData, imagesReady);
    }

    window.Balloon = Balloon;
} (window));
/**
 * ############################################ BALLOON END
 */

/**
 * HUD START
 */
(function(window) {

    function HUD() {

        var instance = this;
        this.isEnabled = false;
        var currentFrame = new Image();

        var stateIcons = appData.hud.states;
        var images;

        this.getRender = function() {

            if(!instance.isEnabled) return;

            render();
            currentFrame.src =  hudCanvas.toDataURL();

            return currentFrame;
        }

        this.render = function() {

            if(!instance.isEnabled) return;

            var score = hero.wallet.points.toString();
            if(score.length < 6) {
                var str = "";
                for(i = 0; i < (6 - score.length); i++) {
                    str += "0";
                }
                score = str + score;
            }

            var cash = hero.wallet.cash.toString();
            if(cash.length < 6) {
                var str = "";
                for(var i = 0; i < (6 - cash.length); i++) {
                    str += "0";
                }
                cash = str + cash;
            }

            context.font = "20px Mono";
            context.fillText(labelsData.HUD.score + score, 0, (canvasH - 20));
            var text = context.measureText(labelsData.HUD.cash + cash + "$");
            context.fillText(labelsData.HUD.cash + cash + "$", (canvasW - text.width), (canvasH - 20));
            context.fillText(labelsData.HUD.drugs + hero.wallet.drugs, 0, (canvasH)- 5);

            if(currentScene.name === brothelScene.name || currentScene.name === paradiseCafeScene.name) {

                var bill = currentScene.bill.toString();
                if(bill.length < 6) {
                    var str = "";
                    for(var i = 0; i < (6 - bill.length); i++) {
                        str += "0";
                    }
                    bill = str + bill;
                }
                context.font = "24px Mono";
                text = context.measureText(labelsData.HUD.bill + bill + "$");
                context.fillText(labelsData.HUD.bill + bill + "$", (canvasW - text.width), (canvasH - 40));
            }

            if(hero.wallet.isStolen) {
                context.drawImage(images[stateIcons.wallet_off], 0, 0, canvasW, canvasH);
            } else {
                context.drawImage(images[stateIcons.wallet_on], 0, 0, canvasW, canvasH);
            }

            if(hero.wallet.hasGun) {
                context.drawImage(images[stateIcons.gun_on], 0, 0, canvasW, canvasH);
            } else {
                context.drawImage(images[stateIcons.gun_off], 0, 0, canvasW, canvasH);
            }
        }

        this.enable = function() {

            instance.isEnabled = true;
        }

        this.disable = function() {

            instance.isEnabled = false;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.enable();
        }

        //LOAD HUD IMAGES
        Utils.loadImages(appData.hud.images, imagesLoaded);
    }

    window.HUD = HUD;

}(window));

/**
 * ############################################ HUD END
 */

/**
 * DOOR START
 */
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
            if(!DEBUG) {
                doorAction = doorData.actions[index];
            } else {
                doorAction = "whore_action";
            }
            door.isOpen = false;
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

/**
 * ############################################ DOOR END
 */

/**
 * HERO START
 */
(function(window) {

    function Hero(data) {

        //OBJECT PROPERTIES
        var INITIAL_CASH = 30000;
        var instance = this;
        var heroData = data;
        var images;
        var anims = heroData.animations;
        var tick = 0;
        var SEX_TIMEOUT = Math.round((NORMAL_SPEED / 3) * 1.50);
        this.SEX_TICK = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = heroData.name;
        this.currentFrame;

        //HERO PROPERTIES
        this.wallet = {
            isStolen: false,
            hasGun: false,
            cash: INITIAL_CASH,
            points: 0,
            drugs: 0
        }

        this.hasShownDocs = false;
        this.hasEnteredBrothel = false;
        this.hasRaped = false;
        this.hasRobbed = false;
        this.hasFucked = false;
        this.isFucking = false;
        this.isDefending = false;
        this.hasDrink = false;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.drink = function() {

            if(tick >= anims.drink.length) {

                instance.hasDrink = false;
                tick = 0;
                return;
            }
            instance.currentFrame = images[anims.drink[tick]];
            tick++;
        }

        this.rapeOldLady = function () {

            if(instance.SEX_TICK === SEX_TIMEOUT) {

                instance.hasRaped = true;
                return;
            }

            if(instance.SEX_TICK <= (anims.undress.length-1)) {

                instance.currentFrame = images[anims.undress[instance.SEX_TICK]];

            } else if(instance.SEX_TICK >= (SEX_TIMEOUT - (anims.dress.length-1))) {

                if(instance.SEX_TICK === (SEX_TIMEOUT - (anims.dress.length-1))) {
                    tick = 0;
                }

                instance.currentFrame = images[anims.dress[tick]];
                tick++;
            } else {

                if(tick >= anims.rape.length) {

                    tick = 0;
                }
                instance.currentFrame = images[anims.rape[tick]];
                tick++;
            }

            instance.SEX_TICK++;
        }

        this.bend = function() {

            instance.currentFrame = images[anims.bend[0]];
        }

        this.oral = function() {

            if(tick >= anims.oral.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.oral[tick]];
            tick++;
            instance.SEX_TICK++;
        }

        this.anal = function() {

            if(tick >= anims.anal.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.anal[tick]];
            tick++;
        }

        this.sex = function() {

            if(tick >= anims.sex.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.sex[tick]];
            tick++;
            instance.SEX_TICK++;
        }

        this.walk = function() {

            if(!instance.isEnabled) return;

            if(tick >= anims.walk.length) {

                tick = 0;

            }

            instance.currentFrame = images[anims.walk[tick]];

            tick++;
        }

        this.robScout = function() {

            if(tick >= anims.rob_scout.length) {

                instance.hasRobbed = true;
                tick = 0;
                return;
            }
            instance.currentFrame = images[anims.rob_scout[tick]];

            tick++;
        }

        this.idleStreet = function(look) {

            if(look === "left") {
                instance.currentFrame = images[anims.street_idle_left[0]];

            } else if(look === "right") {
                instance.currentFrame = images[anims.street_idle_right[0]];

            } else {
                instance.currentFrame = images[anims.street_idle_front[0]];
            }
        }

        this.idleGun = function() {

            instance.currentFrame = images[anims.gun_idle[0]];
        }

        this.idleCafe = function() {

            instance.currentFrame = images[anims.cafe_idle[0]];
        }

        this.showDocs = function() {

            instance.currentFrame = images[anims.show_docs[0]];
        }

        this.enterBrothel = function() {

            if(tick >= anims.enter_building.length) {

                instance.hasEnteredBrothel = true;
                tick = 0;
                return;
            }

            instance.currentFrame = images[anims.enter_building[tick]];

            tick++;
        }

        this.idleBrothel = function() {

            instance.currentFrame = images[anims.brothel_idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
        }

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0
        }

        this.resetTick = function() {
            tick = 0;
        }

        this.reset = function() {

            instance.disable();
            instance.wallet.isStolen =  false;
            instance.wallet.hasGun =  false;
            instance.wallet.cash =  INITIAL_CASH;
            instance.wallet.points =  0;
            instance.wallet.drugs =  0;
            instance.hasShownDocs = false;
            instance.hasEnteredBrothel = false;
            instance.hasRaped = false;
            instance.hasRobbed = false;
            instance.isFucking = false;
            instance.hasFucked = false;
            instance.isDefending = false;
            instance.hasDrink = false;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(heroData.images, imagesLoaded);
    }

    window.Hero = Hero;

}(window));
/**
 * ############################################ HERO END
 */

/**
 * POLICE START
 */
(function(window) {

    function Police(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var policeData = data;
        var images;
        var anims = policeData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = policeData.name;
        this.currentFrame;

        this.isShown = false;
        this.isAgressive = false;
        this.hasAsked = false;
        this.isDone = false;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                instance.isAgressive = Math.random() < 0.5;
                // instance.isAgressive = true;

                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.show[0]];
        }

        this.action = function() {
            instance.currentFrame = images[anims.action[0]];
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;

            instance.currentFrame = images[anims.show[0]];
        }
        

        this.disable = function() {

            instance.isEnabled = false;
            tick = 0;
            instance.isShown = false;
            instance.hasAsked = false;
            instance.isDone = false;
        }

        this.reset = function (){

            instance.disable();
            instance.enable();
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(policeData.images, imagesLoaded);
    }

    window.Police = Police;

}(window));
/**
 * ############################################ POLICE END
 */

/**
 * WHORE START
 */
(function(window) {

    function Whore(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var whoreData = data;
        var images;
        var anims = whoreData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = whoreData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasAsked = false;
        this.action = "";
        this.power;
        this.cost;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle_street[0]];
        }

        this.idleBrothel = function () {

            instance.currentFrame = images[anims.idle_brothel[0]];
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.oral = function() {

            if(tick >= anims.oral.length) {

                tick = 0;
            }
            instance.currentFrame = images[anims.oral[tick]];

            tick++;
        }

        this.sex = function() {

            if(tick >= anims.sex.length) {

                tick = 0;
            }
            instance.currentFrame = images[anims.sex[tick]];

            tick++;
        }

        this.anal = function() {

            if(tick >= anims.anal.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.anal[tick]];
            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];

            instance.cost = Math.round(Utils.getRandomItem([500, 1000, 2000, 3000]));
            instance.power = Math.round(instance.cost / 15);
        }

        this.reset = function() {

            instance.disable();
            instance.enable();
        }
        

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasAsked = false;
            instance.cost = 0;
            instance.action = "";
            instance.currentFrame = images[anims.show[0]];
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(whoreData.images, imagesLoaded);
    }

    window.Whore = Whore;

}(window));
/**
 * ############################################ WHORE END
 */

/**
 * OLDLADY START
 */
(function(window) {

    function OldLady(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var oldLadyData = data;
        var images;
        var anims = oldLadyData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = oldLadyData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.isBended = false;
        this.action = "";

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.show[0]];
        }

        this.bend = function() {

            if(tick >= anims.bend.length) {

                tick = 0;
                instance.isBended = true;
                return;
            }
            instance.currentFrame = images[anims.bend[tick]];

            tick++;
        }

        this.unbend = function() {

            if(tick >= anims.unbend.length) {

                tick = 0;
                instance.isBended = false;
                return;
            }
            instance.currentFrame = images[anims.unbend[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.isBended = false;
            instance.action = "";
            tick = 0;
        }

        this.rob = function() {

            var val = Utils.getRandomItem([100, 500]);
            var msg = "oldlady_only_got_" + val;
            return {
                message: msg,
                value: val
            }
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(oldLadyData.images, imagesLoaded);
    }

    window.OldLady = OldLady;

}(window));
/**
 * ############################################ OLDLADY END
 */

/**
 * THIEF START
 */
(function(window) {

    function Thief(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var thiefData = data;
        var images;
        var anims = thiefData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = thiefData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.isBended = false;
        this.hasPulledCigar = false;
        this.action = "";
        this.isAggressive;
        this.isHurt = false;
        this.scoreValue;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;

                instance.scoreValue = Utils.getRandomItem([100, 200, 300]);
                instance.isAgressive = Math.random() < 0.5;
                // instance.isAgressive = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.show[anims.show.length - 1]];
        }

        this.showGun = function() {

            instance.currentFrame = images[anims.gun[0]];
        }

        this.pullCigar = function() {

            if(tick >= anims.pull_cigar.length) {

                tick = 0;
                instance.hasPulledCigar = true;
                return;
            }
            instance.currentFrame = images[anims.pull_cigar[tick]];

            tick++;
        }

        this.unpullCigar = function() {

            if(tick >= anims.unpull_cigar.length) {

                tick = 0;
                instance.hasPulledCigar = false;
                return;
            }
            instance.currentFrame = images[anims.unpull_cigar[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.hurt = function() {

            if(tick >= anims.hurt.length) {

                tick = 0;
                instance.isHurt = true;
                return;
            }
            instance.currentFrame = images[anims.hurt[tick]];

            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasPulledCigar = false;
            instance.action = "";
            instance.isHurt = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(thiefData.images, imagesLoaded);
    }

    window.Thief = Thief;

}(window));
/**
 * ############################################ THIEF END
 */

/**
 * PIMP START
 */
(function(window) {

    function Pimp(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var pimpData = data;
        var images;
        var anims = pimpData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = pimpData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.isRaping = false;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.rape = function() {

            if(tick >= anims.rape.length) {
                tick = 0;
            }
            instance.currentFrame = images[anims.rape[tick]];
            tick++;
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.isAction = false;
            instance.isRaping = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(pimpData.images, imagesLoaded);
    }

    window.Pimp = Pimp;

}(window));
/**
 * ############################################ PIMP END
 */

/**
 * WAITRESS START
 */
(function(window) {

    function Waitress(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var waitressData = data;
        var images;
        var anims = waitressData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = waitressData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.hasServed = false;
        this.cost;

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                instance.isDone = true;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.serve = function() {

            if(tick >= anims.serve.length) {

                tick = 0;
                instance.hasServed = true;
                return;
            }
            instance.currentFrame = images[anims.serve[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.isDone = false;
            instance.cost = Utils.getRandomItem([100, 200, 450]);
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.hasServed = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(waitressData.images, imagesLoaded);
    }

    window.Waitress = Waitress;

}(window));
/**
 * ############################################ WAITRESS END
 */

/**
 * DEALER START
 */
(function(window) {

    function Dealer(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var dealerData = data;
        var images;
        var anims = dealerData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = dealerData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.madeDeal = false;


        var dealValues = [300, 500, 1000, 5000];

        this.deal = {

            type: "sell",
            value: 200,
            message: [],
            item: ""
        }

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            generateDeal();
            instance.isAction = false;
            instance.madeDeal = false;
            instance.enable();
        }

        var generateDeal = function() {

            instance.deal.type = "";
            instance.deal.value = -1;
            instance.deal.message = [];
            instance.deal.item = "";

            if(hero.wallet.isStolen) {

                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "wallet";
                instance.deal.message = ["dealer_got_wallet", "dealer_accept_" + instance.deal.value];

                return;
            }

            if(!hero.wallet.hasGun) {

                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "gun";
                instance.deal.message = ["dealer_got_gun", "dealer_accept_" + instance.deal.value];

                return;
            }

            var sell = true;
            if(parseInt(hero.wallet.drugs) > 0) {

                sell = Math.random() < 0.5;
            }

            if(sell) {
                
                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "drug";
                instance.deal.message = [("dealer_got_" + Utils.getRandomItem(dealerData.drugs_avail)), ("dealer_accept_" + instance.deal.value)];

            } else {
                instance.deal.type = "buy";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "";
                instance.deal.message = ["dealer_know_you_got_drugs", ("dealer_offer_" + instance.deal.value)];
            }
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.isAction = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(dealerData.images, imagesLoaded);
    }

    window.Dealer = Dealer;

}(window));
/**
 * ############################################ DEALER END
 */


/**
 * SCOUT START
 */
(function(window) {

    function Scout(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var scoutData = data;
        var images;
        var anims = scoutData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = scoutData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasSalute = false;
        this.hasStarted = false;
        this.isAction = false;
        this.isRobbed = false;


        var robValues = [100, 500, 10000, -1, 100, 500, -1, 100, 500, -1, 100, 500, -1, 100, 500, -1];

        this.pack = {
            value: -1,
            message: ""
        }

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.salute = function() {

            if(tick >= anims.salute.length) {

                tick = 0;
                instance.hasSalute = true;
                return;
            }
            instance.currentFrame = images[anims.salute[tick]];

            tick++;
        }

        this.hideRobbed = function() {

            if(tick >= anims.hide_robbed.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide_robbed[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.idleRobbed = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            instance.isAction = false;
            var val = Utils.getRandomItem(robValues);
            var str;
            if(val === -1) {
                str = "cookies";
            } else {
                str = val.toString();
            }
            instance.pack = {
                value: val,
                message: "scout_only_got_" + str
            }
            instance.enable();
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.isAction = false;
            instance.hasSalute = false;
            instance.isRobbed = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];

            instance.reset();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(scoutData.images, imagesLoaded);
    }

    window.Scout = Scout;

}(window));
/**
 * ############################################ SCOUT END
 */


/**
 * SPLASHSCENE START
 */
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
/**
 * ############################################ SPLASHSCENE END
 */

/**
 * MAINSCENE START
 */
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
                labelsData.keys[0],
                labelsData.keys[1]], onKeyboardClick);

            instance.isEnabled = true;

            //reset hero for a new game
            hero.reset();

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
                case labelsData.keys[0].action:

                changeScenes(streetScene.name);
                break;

                //scores action
                case labelsData.keys[1].action:

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
/**
 * ############################################ MAINSCENE END
 */

/**
 * STREETSCENE START
 */
(function(window) {

    function StreetScene(data) {

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
        this.showHUD = true;
        this.currentFrame;

        //ACTIONS STUFF
        var doCurrentAction;

        var actionDone = false;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();
            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;

            switch(action) {

                case "street_action":
                doCurrentAction = streetAction;
                break;
                case "police_action":
                doCurrentAction = policeAction;
                break;
                case "whore_action":
                doCurrentAction = whoreAction;
                break;
                case "oldlady_action":
                doCurrentAction = oldLadyAction;
                break;
                case "thief_action":
                doCurrentAction = thiefAction;
                break;
                case "cafe_action":
                doCurrentAction = cafeAction;
                break;
                case "scout_action":
                doCurrentAction = scoutAction;
                break;
            }
        }

        //ACTIONS
        var scoutAction = function() {

            if(!scout.isDone) {

                if(!door.isOpen) {
                    door.open();
                } else {
                    if(!scout.isShown) {
                        scout.show();
                    } else {
                        if(!scout.hasSalute) {

                            scout.salute();
                        } else {

                            if(!scout.isRobbed) {
                                hero.idleStreet();
                                balloon.showBalloon("scout_hi_friend");
                                if(!keyboard.isVisible) {
                                    keyboard.show([
                                        labelsData.keys[5],
                                        labelsData.keys[6]
                                    ], function(e) {
                                        if(e === "key-assault") {
                                            balloon.hideBalloon();
                                            scout.isRobbed = true;
                                        } else {
                                            scout.isDone = true;
                                        }
                                        keyboard.hide();
                                    });
                                }
                            } else {
                                if(!hero.hasRobbed) {

                                    hero.robScout();

                                } else {
                                    if(!balloon.doneDialog) {

                                        balloon.showDialog(["hero_whats_in_pack", scout.pack.message]);
                                        scout.idleRobbed();
                                    } else {

                                        balloon.hideBalloon();
                                        scout.isDone = true;

                                        if(scout.pack.value !== -1) {
                                            hero.wallet.cash += parseInt(scout.pack.value);
                                            hero.wallet.points += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            } else {
                if(scout.isShown) {
                    if(scout.isRobbed) {
                        scout.hideRobbed();
                    } else {
                        scout.hide();
                    }
                } else {
                    if(door.isOpen) {
                        door.close();
                    } else {
                        hero.hasRobbed = false;
                        balloon.doneDialog = false;
                        scout.reset();
                        door.isScoutDone = false;
                        door.setAction("street_action");
                        changeAction("street_action");
                    }
                }
            }
            
            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                scout.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        var streetAction = function() {

            door.scroll();
            hero.walk();

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                hero.currentFrame
            ];
        }

        var cafeAction = function() {

            if(!door.isCafeDone) {

                hero.idleStreet("left");
                if(!door.isOpen) {

                    door.open();
                } else {

                    door.showParadiseCafe();

                    if(!keyboard.isVisible) {
                        keyboard.show([
                            labelsData.keys[7],
                            labelsData.keys[6],
                        ], function(e) {

                            if(e === "key-enter") {

                                changeScenes(paradiseCafeScene.name);
                            }
                            door.isCafeDone = true;
                            keyboard.hide();
                        });
                    }
                }
            } else {

                if(door.isOpen) {

                    door.close();
                } else {

                    door.isCafeDone = false;
                    door.setAction("street_action");
                    changeAction("street_action");
                }
            }
            
            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                hero.currentFrame,
            ];
        }

        var thiefAction = function() {

            if(!door.isOpen && !thief.isDone) {

                hero.idleStreet();
                door.open();

            } else if(!thief.isDone) {

                if(!thief.isShown) {
                    hero.idleStreet();
                    thief.show();
                } else {

                    if(thief.isAgressive) {

                        if(hero.wallet.hasGun) {

                            if(!hero.isDefending) {

                                thief.showGun();
                                balloon.showBalloon("thief_give_me_your_wallet", null, true);

                                if(!keyboard.isVisible) {

                                    keyboard.showTimedout([
                                        labelsData.keys[8]
                                    ], 3, function(e) {


                                        balloon.hideBalloon();
                                        if(e === "fail") {

                                            thief.isDone = true;
                                        } else {

                                            hero.isDefending = true;
                                        }

                                        keyboard.hide();
                                    });
                                }
                            } else {

                                hero.idleGun();

                                if(!thief.isHurt) {
                                    thief.hurt();
                                } else {

                                    balloon.showBalloon("thief_only_wanted_light");
                                    thief.isDone = true;
                                }
                            }
                            
                        } else {

                            thief.showGun();
                            balloon.showBalloon("thief_give_me_your_wallet");
                            thief.isDone = true;
                        }
                        
                    } else {

                        if(!thief.hasPulledCigar) {

                            thief.pullCigar();
                        } else {

                            if(!balloon.doneDialog) {

                                balloon.showDialog(["thief_got_light", "hero_dont_smoke"]);
                            } else {

                                thief.isDone = true;
                            }
                        }
                    }
                }
            } else {

                if(thief.isShown) {

                    if(thief.hasPulledCigar) {

                        thief.unpullCigar();
                    } else {

                        thief.hide();
                    }
                    
                } else {
                     
                     if(door.isOpen) {
                         
                         balloon.hideBalloon();
                         door.close();
                     } else {
                         
                        if(thief.isAgressive) {


                            var msg = "";
                            if(hero.wallet.hasGun && !thief.isHurt) {
                                msg = "hero_dont_have_gun";
                            } else if(!hero.wallet.hasGun) {
                                msg = "hero_shit";
                            }

                            if(msg !== "") {

                                hero.idleStreet("right");
                                balloon.showBalloon(msg, function() {
                                    hero.wallet.isStolen = true;
                                    hero.wallet.cash = 0;
                                    hero.wallet.points = Math.round(hero.wallet.points / 2);
                                    hero.wallet.drugs = 0;
                                });
                            } else {

                                hero.idleStreet();
                            }

                            if(thief.isHurt){
                                
                                hero.wallet.points += thief.scoreValue;
                            }
                        }

                        thief.reset();
                        balloon.doneDialog = false;
                        hero.isDefending = false;
                        door.setAction("street_action");
                        changeAction("street_action");
                     }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                thief.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        var oldLadyAction = function() {

            if(!actionDone) {

                if(!door.isOpen && !oldLady.isDone) {

                    hero.idleStreet();
                    door.open();
                } else if(!oldLady.isDone) {

                    if(!oldLady.isShown) {

                        hero.idleStreet();
                        oldLady.show();
                    } else if(oldLady.action === "") {

                        setSpeed(0);

                        keyboard.show([
                            labelsData.keys[4],
                            labelsData.keys[5],
                            labelsData.keys[6]
                            ], function(e) {

                                switch(e) {

                                    case "key-rape":
                                    oldLady.action = "rape";
                                    break;

                                    case "key-assault":
                                    oldLady.action = "assault";
                                    break;

                                    case "key-continue":

                                    oldLady.action = "hide";
                                    break;
                                }
                                setSpeed(NORMAL_SPEED);
                                keyboard.hide();
                            });
                    } else {

                        if(oldLady.action === "rape") {

                            if(hero.wallet.hasGun) {


                                if(!balloon.doneDialog) {

                                    hero.idleGun();
                                    balloon.showDialog(["hero_turn_around", "oldlady_ho_my_god"]);
                                } else {

                                    if(!oldLady.isBended && !hero.hasRaped) {

                                        balloon.hideBalloon();
                                        hero.idleStreet();
                                        oldLady.bend();
                                    } else {

                                        if(!hero.hasRaped) {
                                            hero.rapeOldLady();

                                            if(hero.SEX_TICK === Math.round(hero.SEX_TICK / 2)) {
                                                balloon.showDialog(["oldlady_so_big", "hero_its_done"]);
                                            }
                                        } else {

                                            hero.idleStreet();

                                            if(oldLady.isBended) {

                                                oldLady.unbend();
                                            } else {

                                                balloon.showBalloon("oldlady_deserves100");
                                                hero.wallet.points += 100;
                                                oldLady.isDone = true;
                                            }
                                        }
                                    }
                                }

                            } else {
                                hero.idleStreet("right");
                                balloon.showBalloon("hero_no_gun");
                                oldLady.isDone = true;
                            }


                        } else if(oldLady.action === "assault") {

                            if(hero.wallet.hasGun) {

                                if(!balloon.doneDialog) {

                                    hero.idleGun();
                                    balloon.showDialog(["hero_this_is_a_robbery", "oldlady_ho_my_god"]);
                                } else {

                                    if(!hero.hasRobbed) {
                                        var spoils = oldLady.rob();
                                        balloon.showBalloon(spoils.message);
                                        hero.wallet.cash += spoils.value;
                                        hero.hasRobbed = true;

                                    } else {
                                        oldLady.isDone = true;
                                    }
                                }

                            } else {

                                hero.idleStreet("right");
                                balloon.showBalloon("hero_no_gun");
                                oldLady.isDone = true;
                            }


                        } else {

                            oldLady.isDone = true;
                        }
                    }
                } else {

                    hero.idleStreet();
                    if(oldLady.isShown) {

                        oldLady.hide();
                    } else {

                        if(door.isOpen) {

                            door.close();
                        } else {
                            oldLady.reset();
                            balloon.doneDialog = false;
                            hero.hasRaped = false;
                            hero.hasRobbed = false;
                            hero.SEX_TICK = 0;
                            door.setAction("street_action");
                            changeAction("street_action");
                            return;
                        }
                    }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                oldLady.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        var whoreAction = function() {

            if(!actionDone) {

                if(!door.isOpen && !whore.isDone) {

                    door.open();
                } else if(!whore.isDone){

                    if(!whore.isShown) {

                        hero.idleStreet("left");
                        whore.show();
                    } else {

                        if(!whore.hasAsked) {

                            var question = Utils.getRandomItem( balloon.getData("whore_street_question") );
                            balloon.showBalloon(question, null, true);
                            whore.hasAsked = true;

                            keyboard.show([
                                labelsData.keys[2],
                                labelsData.keys[3]
                                ], function(e) {

                                    if(e === "key-yes") {

                                        whore.action = "positive_call";
                                    }
                                    
                                    balloon.hideBalloon();
                                    keyboard.hide();
                                });
                        } else {

                            if(!whore.isDone) {

                                if(whore.action === "positive_call") {

                                    balloon.showBalloon("whore_come_on_then");
                                    whore.isDone = true;
                                    hero.resetTick();
                                } else {

                                    whore.isDone = true;
                                }
                            }
                        }
                    }
                } else {

                    if(whore.isShown) {

                        whore.hide();
                    } else {
                        if(whore.action === "positive_call" && !hero.hasEnteredBrothel) {

                            hero.enterBrothel();
                        } else {

                            if(door.isOpen) {
                                
                                door.close();
                            } else {
                                hero.hasShownDocs = false;

                                if(whore.action !== "positive_call") {

                                    balloon.showBalloon("hero_pussy");
                                    hero.idleStreet("right");
                                } else {


                                    changeScenes(brothelScene.name);
                                    hero.hasEnteredBrothel = false;
                                }
                                whore.reset();
                                door.setAction("street_action");
                                changeAction("street_action");
                            }
                        }
                    }
                }
            } 

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                whore.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }


        var policeAction = function() {

            if(!actionDone) {

                hero.idleStreet();

                if(!door.isOpen && !police.isDone) {
                    door.open();
                } else if(!police.isDone) {

                    if(!police.isShown) {

                        police.show();
                    } else {

                        if(police.isAgressive) {
                            
                            police.action();

                            if(!police.hasAsked) {
                                
                                balloon.showBalloon("police_ask_docs");
                                police.hasAsked = true;

                            } else {

                                if(hero.wallet.isStolen) {

                                    if(hero.hasShownDocs) {
                                        balloon.showBalloon("police_come_with_me", function() {
                                            changeScenes("jail_scene");
                                        });

                                    } else {
                                        balloon.showBalloon("hero_no_wallet");
                                        hero.hasShownDocs = true;
                                    }
                                } else {

                                    if(!hero.hasShownDocs) {
                                    hero.showDocs();
                                    hero.hasShownDocs = true;
                                    wait(1);

                                    } else {

                                        if(!police.isDone) {
                                            balloon.showBalloon("police_ok_you_can_go");
                                            police.isDone = true;
                                        }
                                    }
                                }
                            }

                        } else {

                            if(!police.hasAsked) {

                                balloon.showBalloon("police_how_its_going");
                                police.hasAsked = true;
                            } else {

                                if(!hero.hasShownDocs) {

                                    balloon.showBalloon("hero_everything_fine");
                                    hero.hasShownDocs = true;
                                } else {
                                    police.isDone = true;
                                }
                            }
                        }
                    }
                } else {

                    if(police.isShown) {

                        police.hide();
                    } else {

                        if(door.isOpen) {
                            
                            door.close();
                        } else {
                            police.reset();
                            hero.hasShownDocs = false;
                            door.setAction("street_action");
                            changeAction("street_action");
                        }
                    }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                police.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#0000C0";

            instance.isEnabled = true;

            door.enable();
            door.addEventListener(changeAction);
            hero.enable();
            whore.enable();
            police.enable();

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            
            setSpeed(NORMAL_SPEED);

            changeAction("street_action");
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            actionDone = false;
            tick = 0

            door.disable();
            door.removeEventListener();
            hero.disable();
            whore.disable();
            police.disable();
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.StreetScene = StreetScene;

}(window));
/**
 * ############################################ STREETSCENE END
 */

/**
 * JAILSCENE START
 */
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
                    labelsData.keys[9],
                    labelsData.keys[10]
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
                    labelsData.keys[9]
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
/**
 * ############################################ JAILSCENE END
 */

/**
 * BROTHELSCENE START
 */
(function(window) {

    function BrothelScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var SEX_TIMEOUT = Math.round((NORMAL_SPEED / 3) * 1.50);
        var SEX_TICK = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.bill = 0;
        this.showHUD = true;

        //ACTIONS STUFF
        var doCurrentAction;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();

            instance.currentFrame = [
                images[anims.background[0]],
                whore.currentFrame,
                hero.currentFrame,
                pimp.currentFrame,
                balloon.currentFrame
            ];

            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;
            SEX_TICK = 0;

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

        var analAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_eat_your_ass");
                hero.isFucking = true;
            } else {
                whore.anal();
                hero.anal();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === Math.round(v)) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("whore_so_thick", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_aaa", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var sexAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_eat_your_pussy");
                hero.isFucking = true;
            } else {
                whore.sex();
                hero.sex();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_im_coming", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var oralAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_do_me_blowjob");
                hero.isFucking = true;
            } else {
                whore.oral();
                hero.oral();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === Math.round(v)) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_suck_it_all", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_so_good", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var pimpAction = function() {

            whore.idleBrothel();
            hero.idleBrothel();

            if(!whore.hasAsked) {

                balloon.showBalloon("hero_no_cash_brothel");
                whore.hasAsked = true;
                
            } else {

                if(!pimp.isAction) {
                    if(!pimp.hasStarted) {
                    
                        balloon.showBalloon("whore_call_pimp");
                        pimp.hasStarted = true;

                    } else {

                        if(!pimp.isShown) {
                            pimp.show();
                        } else {

                            balloon.showBalloon("pimp_hello");
                            pimp.isAction = true;
                        }
                    }

                } else {

                    if(!pimp.isRaping) {

                        if(!balloon.doneDialog) {
                            pimp.idle();
                            balloon.showDialog(["pimp_whats_going_on", "whore_this_no_pay", "pimp_he_will_see"]);
                        } else {

                            pimp.isRaping = true;
                            balloon.hideBalloon();
                        }
                        
                    } else {

                        SEX_TICK++;

                        if(SEX_TICK === SEX_TIMEOUT - Math.round(SEX_TIMEOUT / 4)) {
                            balloon.justShowBalloon("hero_what_a_dick");
                        }

                        if(SEX_TICK === SEX_TIMEOUT){

                            pimp.reset();
                            hero.wallet.points = 0;
                            hero.wallet.cash = 0;
                            changeScenes(streetScene.name);
                        }

                        whore.idleBrothel();
                        hero.bend();
                        pimp.rape();
                    }
                }
            }
        }

        var idleAction = function() {

            whore.idleBrothel();
            hero.idleBrothel();

            if(hero.hasFucked) {

                if(!whore.hasAsked) {

                    balloon.showBalloon("whore_cost_" + whore.cost.toString(), null, true);
                    whore.hasAsked = true;
                    instance.bill = whore.cost;

                    if(!keyboard.isVisible) {

                        keyboard.show([
                            labelsData.keys[17]

                        ], function(e) {

                            balloon.hideBalloon();
                            if(hero.wallet.cash < instance.bill) {
                                whore.hasAsked = false;

                                changeAction("pimp_action");
                            } else {
                                hero.wallet.cash -= instance.bill;
                                hero.wallet.points += whore.power;
                                changeScenes(streetScene.name);
                            }
                            keyboard.hide();
                        });
                    }
                }

            } else {
                balloon.showBalloon("whore_what_you_want", null, true);
                keyboard.show([
                    labelsData.keys[11],
                    labelsData.keys[12],
                    labelsData.keys[13]
                ], onKeyPress);
            }
        }

        var onKeyPress = function(e) {

            balloon.hideBalloon();
            switch(e) {
                case "key-oral":
                changeAction("oral_action");
                break;
                case "key-sex":
                changeAction("sex_action");
                break;
                case "key-anal":
                changeAction("anal_action");
                break;
            }

            keyboard.hide();
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bd00bd";

            instance.isEnabled = true;

            hero.enable();
            whore.enable();

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            changeAction("idle_action");
            instance.bill = 0;
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
            instance.bill = 0;
            hero.isFucking = false;
            hero.hasFucked = false;
            hero.SEX_TICK = 0;
            whore.disable();
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
/**
 * ############################################ BROTHELSCENE END
 */

/**
 * RECORDESSCENE START
 */
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
/**
 * ############################################ RECORDESSCENE END
 */

/**
 * PARADISECAFESCENE START
 */
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
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.bill = 20;
        this.showHUD = true;
        
        var isServed = false;
        var doDeal;

        var CAFE_TIMEOUT = Math.round((NORMAL_SPEED / 2) * 1.50);
        var CAFE_TICK = 0;

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
                keyboard.enablePermKey();
                waitress.reset();
                break;

                case "serve_action":
                doCurrentAction = serveAction;
                keyboard.disablePermKey();
                break;

                case "drink_action":
                doCurrentAction = drinkAction;
                keyboard.disablePermKey();
                break;

                case "deal_action":
                doCurrentAction = dealAction;
                keyboard.disablePermKey();
                dealer.reset();
                break;

                case "exit_action":
                doCurrentAction = exitAction;
                keyboard.disablePermKey();
                break;
            }

            if(hero.currentFrame === undefined) return;
        }

        var dealAction = function() {

            if(!dealer.isDone) {

                if(!dealer.isShown) {

                    dealer.show();
                } else {

                    if(!balloon.doneDialog) {
                        balloon.showDialog(dealer.deal.message);
                    } else {
                        var sellType = (dealer.deal.type === "sell");
                        var isValid = true;
                        if(sellType) {

                            if(hero.wallet.cash < parseInt(dealer.deal.value)) {

                                isValid = false;
                                balloon.showBalloon("hero_no_cash_cafe", function() {
                                    dealer.isDone = true;
                                });
                            }
                        }

                        if(dealer.isAction) {

                            if(keyboard.isVisible) {
                                keyboard.hide();
                            }

                            if(dealer.madeDeal) {

                                if(dealer.deal.type === "sell") {

                                    switch(dealer.deal.item) {

                                        case "wallet":
                                        hero.wallet.isStolen = false;
                                        break;
                                        case "gun":
                                        hero.wallet.hasGun = true;
                                        break;
                                        case "drug":
                                        hero.wallet.drugs += 1;
                                        break;
                                    }
                                    hero.wallet.cash -= parseInt(dealer.deal.value);
                                    
                                } else {
                                    hero.wallet.cash += parseInt(dealer.deal.value);
                                    hero.wallet.drugs -= 1;
                                }

                                balloon.showBalloon("hero_accept", function() {
                                    dealer.isDone = true;
                                });

                            } else {

                                balloon.showBalloon("hero_refuse", function() {
                                    dealer.isDone = true;
                                });
                            }
                        }

                        if(isValid && !keyboard.isVisible && !dealer.isAction) {
                            keyboard.show([
                                labelsData.keys[15],
                                labelsData.keys[16]
                            ], onKeyboardClick);
                        }
                    }
                }
            } else {

                if(dealer.isShown) {
                    dealer.hide();
                } else {
                    changeAction("idle_action");
                    balloon.doneDialog = false;
                }
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame,
                dealer.currentFrame,
                balloon.currentFrame
            ];
        }

        var exitAction = function () {

            if(!waitress.isDone) {

                if(!waitress.isShown) {

                    waitress.show();
                } else {

                    if(!waitress.hasServed) {

                        if(!balloon.isShowing) {
                            balloon.showBalloon("waitress_your_bill", null, true);
                            keyboard.show([
                                labelsData.keys[17]
                            ], function() {
                                keyboard.hide();
                                balloon.hideBalloon();
                                waitress.hasServed = true;
                            });
                        }
                        
                    } else {

                        if(instance.bill > hero.wallet.cash){
                            if(!balloon.doneDialog) {
                                balloon.showDialog(["hero_no_cash_cafe", "waitress_wait_there"]);
                            } else {
                                balloon.hideBalloon();
                                keyboard.hide();
                                changeScenes(jailScene.name);
                            }
                        } else {
                            hero.wallet.cash -= instance.bill;
                            waitress.isDone = true;
                        }
                    }
                }
            } else {

                keyboard.hide();
                waitress.hasServed = false;
                balloon.doneDialog = false;
                waitress.reset();
                changeScenes(streetScene.name);
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame,
                waitress.currentFrame,
                balloon.currentFrame
            ];
        }

        var drinkAction = function() {

            if(hero.hasDrink) {
                hero.drink();
            } else {

                changeAction("idle_action");
                hero.hasDrink = false;
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame
            ];
        }

        var serveAction = function() {

            if(hero.hasDrink) {
                changeAction("drink_action");
            } else if(waitress.isDone) {
                changeAction("idle_action");
                hero.hasDrink = true;
                instance.bill += waitress.cost;
            } else {

                if(!waitress.isShown) {

                    waitress.show();
                } else {

                    if(!waitress.hasServed) {

                        waitress.serve();
                    } else {

                        waitress.hide();
                    }
                }
            }

            instance.currentFrame = [
                backgroundFrame,
                waitress.currentFrame,
                hero.currentFrame
            ];
        }

        var idleAction = function() {

            if(CAFE_TICK === CAFE_TIMEOUT) {

                doDeal = Math.random() < 0.5;

                if(doDeal) {

                    changeAction("deal_action");
                } else {

                    changeAction("serve_action");
                }
                CAFE_TICK = 0;
            } else {

                hero.idleCafe();
            }

            CAFE_TICK++;

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame
            ];
        }

        var onKeyboardClick = function(e) {

            if(balloon.isShowing) {

                balloon.hideBalloon();
            }

            switch(e) {

                case "key-exit":
                changeAction("exit_action");
                keyboard.hidePerm();
                break;

                case "key-accept":
                dealer.isAction = true;
                dealer.madeDeal = true;
                break;

                case "key-refuse":
                dealer.isAction = true;
                dealer.madeDeal = false;
                break;
            }
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

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            changeAction("idle_action");

            backgroundInterval = setInterval(updateBackground, NORMAL_SPEED * 50);

            keyboard.showPerm([
                labelsData.keys[14]
            ],onKeyboardClick);

            instance.bill = 20;
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
            backgroundInterval = clearInterval(backgroundInterval);
            backgroundInterval = null;
            isServed = false;
            CAFE_TICK = 0;
            hero.hasDrink = false;

            keyboard.hidePerm();

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
/**
 * ############################################ PARADISECAFESCENE END
 */

/**
 * APP START
 */
//DEBUG
var DEBUG = false;

//LANGUAGE
var lang;

//ROOT REFERNCE
var root = "http://brunoperry.net/paradisecafe2/";
//ANIM PROPERTIES
var TRANSTION_TIME = 2000;
var NORMAL_SPEED = 150;
var SPEED = NORMAL_SPEED;
var interval;
//landing page
var landingPage;
//Door
var door;
//canvas properties
var context;
var hudContext;
var canvas;
var canvasW;
var canvasH;
var currentFrame;
//scenes
var numScenes = 0;
var splashScene;
var mainScene;
var streetScene;
var brothelScene;
var paradiseCafeScene;
var currentScene;
//characters
var hero;
var police;
var whore;
var oldLady;
var thief;
var pimp;
var dealer;
var waitress;
var scout;
//balloons
var balloon;
//hud
var hud;
//side menu
var sideMenu;
//audio
var audioSource;
var isTransition = false;

function init() {

    //LANGUAGE
    lang = document.body.dataset.lang;
    
    //landing page stuff
    landingPage = document.getElementById("landing-page");
    //setup render stuff
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.font="24px Mono";
    context.fillStyle = "#ffffff";
    canvasW = canvas.width;
    canvasH = canvas.height;
    //setup audio
    audioSource = new AudioSource();
    //setup door object
    door = new Door(appData.door);
    //setup balloon
    balloon = new Balloon(labelsData.balloons);
    //setup keyboard
    keyboard = new Keyboard();
    //setup hud
    hud = new HUD();
    //setup side menu
    sideMenu = new SideMenu();
    //setup characters
    hero = new Hero(appData.characters[0]);
    police = new Police(appData.characters[1]);
    whore = new Whore(appData.characters[2]); 
    oldLady = new OldLady(appData.characters[3]); 
    thief = new Thief(appData.characters[4]);
    pimp = new Pimp(appData.characters[5]);
    waitress = new Waitress(appData.characters[6]);
    dealer = new Dealer(appData.characters[7]);
    scout = new Scout(appData.characters[8]);
    //setup scenes
    splashScene = new SplashScene(appData.scenes[0]);
    mainScene = new MainScene(appData.scenes[1]);
    streetScene = new StreetScene(appData.scenes[2]);
    jailScene = new JailScene(appData.scenes[3]);
    brothelScene = new BrothelScene(appData.scenes[4]);
    paradiseCafeScene = new ParadiseCafeScene(appData.scenes[5]);
    recordsScene = new RecordsScene(appData.scenes[6]);
    //prepare
    onResize();
}

function initGame() {
    document.getElementById("age-question").style.display = "block";
    keyboard.show([
        labelsData.keys[2],
        labelsData.keys[3]
    ], function(e) {
        keyboard.hide();
        if(e === "key-yes") {
            landingPage.style.display = "none";
            startGame();
        } else {
            window.open("https://www.youtube.com/watch?v=PyAZaMtvrDY","_self");
        }
    });
}

function startGame() {
    //start
    if(!DEBUG) {
        changeScenes(splashScene.name);
    } else {
        changeScenes(streetScene.name);
    }
}

function gameLoop() {
    if(currentScene.isReady) {
        currentScene.update();
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canvasW, canvasH);
}
function render(image) {
    clearCanvas();
    for(i = 0; i < image.length; i++) {
        context.drawImage(image[i], 0, 0, canvasW, canvasH);
    }
    if(currentScene.showHUD) {
        hud.render();
    }
}

function changeScenes(sceneName) {
    if(currentScene) {
        if(currentScene.name === sceneName) {
            return;
        }
    }
    var previousScene = currentScene;
    balloon.clearBalloon();
    switch(sceneName) {
        case splashScene.name:
        currentScene = splashScene;
        sideMenu.disable();
        break;
        case mainScene.name:
        currentScene = mainScene;
        sideMenu.enable();
        break;
        case streetScene.name:
        currentScene = streetScene;
        sideMenu.enable();
        break;
        case jailScene.name:
        currentScene = jailScene;
        sideMenu.enable();
        break;
        case brothelScene.name:
        currentScene = brothelScene;
        sideMenu.enable();
        break;
        case paradiseCafeScene.name:
        currentScene = paradiseCafeScene;
        sideMenu.enable();
        break;
        case recordsScene.name:
        currentScene = recordsScene;
        sideMenu.enable();
        break;
    }
    if(previousScene) {
        if(previousScene.doTransition) {
            transition(previousScene);
        } else {
            previousScene.disable();
            currentScene.enable();
        }
    } else {
        currentScene.enable();
    }
}

function setSpeed(speed) {
    if(SPEED !== speed) {
        SPEED = speed;
    }
    if(speed === 0) {
        clearInterval(interval);
        interval = null;
        return;
    }
    if(interval) {
        clearInterval(interval);
        interval = null;
        interval = setInterval(gameLoop, SPEED);
    } else {
        interval = setInterval(gameLoop, SPEED);
    }
}

function wait(seconds) {
    var prevSpeed = SPEED;
    setSpeed(0);
    setTimeout(function() {
        setSpeed(prevSpeed);
    }, seconds * 1000);
}

function sceneReady() {
    numScenes++;
    if(numScenes === appData.scenes.length) {
        initGame();
    }
}

function onResize() {
    canvasW = canvas.width;
    canvasH = canvas.height;
    var pos = canvas.getBoundingClientRect();
    var ni = document.getElementById("name-input");
    var x = Math.round((canvas.offsetWidth / 2 ) - (128 / 2));
    var y = Math.round((pos.top + canvas.offsetHeight - 40));
    ni.style.left = x + "px";
    ni.style.top = y + "px";
}

function d(message) {
    console.log(message);
    document.getElementById("debugger").innerHTML = message;
}

//EVENTS
window.onresize = function() {
    onResize();
}

//EFFECTS
function transition(prevScene) {
    isTransition = true;
    setSpeed(0);
    var int;
    var blocksize = 2;
    var vc = document.createElement("canvas");
    vc.width = canvasW;
    vc.height = canvasH;
    var vctx = vc.getContext("2d");
    vctx.drawImage(canvas, 0, 0);
    int = setInterval(function(e) {
        blocksize += Math.round(blocksize / 2);
        for(var x = 1; x < canvasW; x += blocksize) {
            for(var y = 1; y < canvasH; y += blocksize) {
                var pixel = vctx.getImageData(x, y, 1, 1);
                context.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
                context.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
            }
        }
        if(blocksize >= 32) {
            context.fillStyle = "white";
            isTransition = true;
            
            setSpeed(SPEED);
            prevScene.disable();
            currentScene.enable();
            clearInterval(int);
        }
    }, 200);
}
//WELCOME MESSAGE
console.log("%c PARADISE CAFÉ 2 / C.C.2016", "background: #222; color: #bada55" );
/**
 * ############################################ APP END
 */
