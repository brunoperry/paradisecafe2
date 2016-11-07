/**
 * UTILS START
 */
(function(window) {

    function Utils() {};

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

        for(balloon in dataIn) {
            dataOut[balloon] = new Image();
            dataOut[balloon].onload = function() {
                imagesLoaded++;
                if(imagesLoaded === totalImages) {
                    callback(dataOut);
                }
            }
            dataOut[balloon].src = "media/images/balloons_" + balloon + ".png";
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

        var BALLOON_TIMEOUT = 1000;

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
            context.fillText("SCORE=" + score, 0, (canvasH - 20));
            var text = context.measureText("DINHEIRO=" + cash + "$");
            context.fillText("DINHEIRO=" + cash + "$", (canvasW - text.width), (canvasH - 20));
            context.fillText("DROGAS=" + hero.wallet.drugs, 0, (canvasH)- 5);

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
                text = context.measureText("DESPESA=" + bill + "$");
                context.fillText("DESPESA=" + bill + "$", (canvasW - text.width), (canvasH - 40));
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
            doorAction = doorData.actions[index];
            // doorAction = "police_action";
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

        this.rape = function () {

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

        this.enable = function() {

            document.body.style.backgroundColor = "#bd0000";

            instance.isEnabled = true;

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(SCENE_SPEED);
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
                appData.keys[0],
                appData.keys[1]], onKeyboardClick);

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
                case appData.keys[0].action:

                changeScenes(streetScene.name);
                break;

                //scores action
                case appData.keys[1].action:

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
            }
        }

        //ACTIONS
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
                            appData.keys[7],
                            appData.keys[6],
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
                                        appData.keys[8]
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
                            appData.keys[4],
                            appData.keys[5],
                            appData.keys[6]
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
                                            hero.rape();

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
                                appData.keys[2],
                                appData.keys[3]
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

            document.body.style.backgroundColor = "blue";

            instance.isEnabled = true;

            door.enable();
            door.addEventListener(changeAction);
            hero.enable();
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
                            appData.keys[14]

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
                    appData.keys[11],
                    appData.keys[12],
                    appData.keys[13]
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
                                appData.keys[15],
                                appData.keys[16]
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

                        balloon.showBalloon("waitress_your_bill");
                        waitress.hasServed = true;
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
                changeScenes(streetScene.name);
                waitress.hasServed = false;
                balloon.doneDialog = false;
                waitress.reset();
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
                appData.keys[14]
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
 * APPDATA START
 */
var appData = {

    "scenes": [
        {
            "id": 0,
            "name": "splash_scene",
            "images": ["splash_bckgrd01", "splash_bckgrd02", "splash_bckgrd03"],
            "animations":
            {
                "background": [0, 1, 0, 2]
            }
        },
        {
            "id": 1,
            "name": "main_scene",
            "images": ["main_bckgrd01", "main_bckgrd02"],
            "animations":
            {
                "background": [0, 1]
            }
        },
        {
            "id": 2,
            "name": "street_scene",
            "images": ["street_bckgrd01", "splash_bckgrd02", "splash_bckgrd03"],
            "animations":
            {
                "background": [0]
            }
        },
        {
            "id": 3,
            "name": "jail_scene",
            "images": ["jail_bckgrd01", "jail_bckgrd02"],
            "animations":
            {
                "background": [0, 1]
            }
        },
        {
            "id": 4,
            "name": "brothel_scene",
            "images": ["brothel_bckgrd01"],
            "animations":
            {
                "background": [0]
            }
        },
        {
            "id": 5,
            "name": "paradisecafe_scene",
            "images": ["paradisecafe_bckgrd01", "paradisecafe_bckgrd02", "paradisecafe_bckgrd03", "paradisecafe_bckgrd04"],
            "animations":
            {
                "background": [0, 1, 2, 3]
            }
        },
        {
            "id": 6,
            "name": "records_scene",
            "images": ["records_bckgrd01", "records_bckgrd02"],
            "animations":
            {
                "background": [0, 0, 1, 1]
            }
        }
    ],

    "characters": [
        {
            "id": 0,
            "name": "hero",
            "images": 
                [
                    "hero_street_idle_left",
                    "hero_street_idle_front",
                    "hero_street_idle_right",
                    "hero_walk01",
                    "hero_walk02",
                    "hero_walk03",
                    "hero_walk04",
                    "hero_show_docs",
                    "hero_enter_building01",
                    "hero_enter_building02",        //10
                    "hero_enter_building03",
                    "hero_idle_brothel",
                    "hero_idle_gun",
                    "hero_rape01",
                    "hero_rape02",
                    "hero_rape03",
                    "hero_rape04",
                    "hero_rape05",
                    "hero_idle_cafe",
                    "hero_blowjob01",               //20
                    "hero_blowjob02",
                    "hero_bend",
                    "hero_anal01",
                    "hero_anal02",
                    "hero_sex01",
                    "hero_sex02",
                    "hero_drink01",
                    "hero_drink02"                  //28
                ],
            "animations":
            {
                "street_idle_left": [0],
                "street_idle_front": [1],
                "street_idle_right": [2],
                "walk": [3, 4, 5, 6],
                "show_docs": [7],
                "enter_building": [8, 9, 10],
                "brothel_idle": [11],
                "gun_idle": [12],
                "undress": [13, 14, 15],
                "rape": [16, 17],
                "dress": [15, 14, 13],
                "cafe_idle": [18],
                "oral": [19, 20],
                "bend": [21],
                "anal": [22, 23],
                "sex": [24, 25],
                "drink": [18, 26, 27, 27, 27, 27, 27, 26, 18]
            }
        },
        {
            "id": 1,
            "name": "police",
            "images": 
                [
                    "police_show01",
                    "police_show02",
                    "police_show03",
                    "police_action"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_door": [2],
                "action": [3],
            }
        },
        {
            "id": 2,
            "name": "whore",
            "images": 
                [
                    "whore_show01",
                    "whore_show02",
                    "whore_show03",
                    "whore_idle_brothel",
                    "whore_blowjob01",
                    "whore_blowjob02",
                    "whore_anal01",
                    "whore_anal02",
                    "whore_sex01"
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
                "idle_brothel": [3],
                "oral": [4, 5],
                "anal": [6, 7],
                "sex": [8]
            }
        },
        {
            "id": 3,
            "name": "oldlady",
            "images": 
                [
                    "oldlady_show01",
                    "oldlady_show02",
                    "oldlady_show03",
                    "oldlady_bended01",
                    "oldlady_bended02",
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "hide": [2, 1, 0],
                "idle_street": [2],
                "bend": [2, 3, 4],
                "unbend": [4, 3, 2]
            }
        },
        {
            "id": 4,
            "name": "thief",
            "images": 
                [
                    "thief_show01",
                    "thief_show02",
                    "thief_show03",
                    "thief_show04",
                    "thief_gun",
                    "thief_hide01",
                    "thief_hide02",
                    "thief_hide03",
                    "thief_pull_cigar01",
                    "thief_pull_cigar02",
                    "thief_hurt01",
                    "thief_hurt02",
                    "thief_hurt03"
                ],
            "animations":
            {
                "show": [0, 1, 2, 3],
                "gun": [4],
                "hide": [5, 6, 7],
                "pull_cigar": [3, 8, 9],
                "unpull_cigar": [9, 8, 3],
                "hurt": [10, 11, 12, 12, 12, 12, 12, 12]
            }
        },
        {
            "id": 5,
            "name": "pimp",
            "images": 
                [
                    "pimp_show01",
                    "pimp_show02",
                    "pimp_idle",
                    "pimp_rape01",
                    "pimp_rape02"
                ],
            "animations":
            {
                "show": [0, 1, 1, 1],
                "idle": [2],
                "rape": [3, 4]
            }
        },
        {
            "id": 6,
            "name": "waitress",
            "images": 
                [
                    "waitress_show01",
                    "waitress_show02",
                    "waitress_show03",
                    "waitress_serve",
                ],
            "animations":
            {
                "show": [0, 1, 2],
                "idle": [2],
                "serve": [3, 3, 3, 3, 3, 3],
                "hide": [2, 1, 0]
            }
        },
        {
            "id": 7,
            "name": "dealer",
            "images": 
                [
                    "dealer_show01",
                    "dealer_show02",
                    "dealer_show03",
                    "dealer_show04"
                ],
            "animations":
            {
                "show": [0, 1, 2, 3],
                "idle": [2],
                "hide": [3, 2, 1, 0]
            },
            drugs_avail: ["lsd", "weed"]

        }
    ],
    "hud": {
        "images": 
            [
                "icons_gun_on",
                "icons_gun_off",
                "icons_wallet_on",
                "icons_wallet_off"
            ],
        "states":
        {
            "gun_on": 0,
            "gun_off": 1,
            "wallet_on": 2,
            "wallet_off": 3
        }
    },
    "keys": [
        {
            "id": 0,
            "label": "JOGAR",
            "action": "key-play"
        },
        {
            "id": 1,
            "label": "HISCORES",
            "action": "key-scores"
        },
        {
            "id": 2,
            "label": "SIM",
            "action": "key-yes"
        },
        {
            "id": 3,
            "label": "NÃO",
            "action": "key-no"
        },
        {
            "id": 4,
            "label": "VIOLAR",
            "action": "key-rape"
        },
        {
            "id": 5,
            "label": "ROUBAR",
            "action": "key-assault"
        },
        {
            "id": 6,
            "label": "CONT.",
            "action": "key-continue"
        },
        {
            "id": 7,
            "label": "ENTRAR",
            "action": "key-enter"
        },
        {
            "id": 8,
            "label": "DEFESA",
            "action": "key-defend"
        },
        {
            "id": 9,
            "label": "INICIO",
            "action": "key-restart"
        },
        {
            "id": 10,
            "label": "REGISTAR",
            "action": "key-register"
        },
        {
            "id": 11,
            "label": "ORAL",
            "action": "key-oral"
        },
        {
            "id": 12,
            "label": "SEXO",
            "action": "key-sex"
        },
        {
            "id": 13,
            "label": "ANAL",
            "action": "key-anal"
        },
        {
            "id": 14,
            "label": "SAIR",
            "action": "key-exit"
        },
        {
            "id": 15,
            "label": "ACEITAR",
            "action": "key-accept"
        },
        {
            "id": 16,
            "label": "RECUSAR",
            "action": "key-refuse"
        }
    ],
    "door":
    {
        "id": 0,
        "name": "door",
        "images": ["door_scroll", "door_open01", "door_open02", "door_cafe01", "door_cafe02", "door_cafe03", "door_cafe04"],
        "animations":
        {
            "scroll": [0],
            "open": [0, 1, 2],
            "close": [2, 1, 0],
            "show_cafe": [3, 4, 5, 6]
        },
        "actions": 
            [
                "street_action",
                "police_action",
                "whore_action",
                "thief_action",
                "oldlady_action",
                "cafe_action"
            ]
    },
    "balloons": {
        
        "empty": "empty",
        "hero_no_wallet": "hero_no_wallet",
        "hero_everything_fine": "hero_everything_fine",
        "hero_pussy": "hero_pussy",
        "hero_its_done": "hero_its_done",
        "hero_shit": "hero_shit",
        "hero_no_gun": "hero_no_gun",
        "hero_dont_have_gun": "hero_dont_have_gun",
        "hero_dont_smoke": "hero_dont_smoke",
        "hero_this_is_a_robbery": "hero_this_is_a_robbery",
        "hero_turn_around": "hero_turn_around",
        "hero_do_me_blowjob": "hero_do_me_blowjob",
        "hero_suck_it_all": "hero_suck_it_all",
        "hero_so_good": "hero_so_good",
        "hero_eat_your_ass": "hero_eat_your_ass",
        "hero_no_cash_brothel": "hero_no_cash_brothel",
        "hero_what_a_dick": "hero_what_a_dick",
        "hero_aaa": "hero_aaa",
        "hero_eat_your_pussy": "hero_eat_your_pussy",
        "hero_im_coming": "hero_im_coming",
        "hero_accept": "hero_accept",
        "hero_refuse": "hero_refuse",
        "hero_no_cash_cafe": "hero_no_cash_cafe",

        "police_ask_docs": "police_ask_docs",
        "police_come_with_me": "police_come_with_me",
        "police_ok_you_can_go": "police_ok_you_can_go",
        "police_how_its_going": "police_how_its_going",

        "whore_street_question01": "whore_street_question01",
        "whore_street_question02": "whore_street_question02",
        "whore_street_question03": "whore_street_question03",
        "whore_come_on_then": "whore_come_on_then",
        "whore_cost_3000": "whore_cost_3000",
        "whore_cost_2000": "whore_cost_2000",
        "whore_cost_1000": "whore_cost_1000",
        "whore_cost_500": "whore_cost_500",
        "whore_what_you_want": "whore_what_you_want",
        "whore_call_pimp": "whore_call_pimp",
        "whore_this_no_pay": "whore_this_no_pay",
        "whore_so_thick": "whore_so_thick",

        "pimp_hello": "pimp_hello",
        "pimp_he_will_see": "pimp_he_will_see",
        "pimp_whats_going_on": "pimp_whats_going_on",

        "oldlady_deserves100": "oldlady_deserves100",
        "oldlady_ho_my_god": "oldlady_ho_my_god",
        "oldlady_so_big": "oldlady_so_big",
        "oldlady_only_got_100": "oldlady_only_got_100",
        "oldlady_only_got_500": "oldlady_only_got_500",

        "thief_give_me_your_wallet": "thief_give_me_your_wallet",
        "thief_got_light": "thief_got_light",
        "thief_only_wanted_light": "thief_only_wanted_light",

        "dealer_got_lsd": "dealer_got_lsd",
        "dealer_got_weed": "dealer_got_weed",
        "dealer_know_you_got_drugs": "dealer_know_you_got_drugs",
        "dealer_accept_300": "dealer_accept_300",
        "dealer_accept_500": "dealer_accept_500",
        "dealer_accept_1000": "dealer_accept_1000",
        "dealer_accept_5000": "dealer_accept_5000",
        "dealer_offer_300": "dealer_offer_300",
        "dealer_offer_500": "dealer_offer_500",
        "dealer_offer_1000": "dealer_offer_1000",
        "dealer_offer_5000": "dealer_offer_5000",
        "dealer_got_wallet": "dealer_got_wallet",
        "dealer_got_gun": "dealer_got_gun",

        "waitress_wait_there": "waitress_wait_there",
        "waitress_your_bill": "waitress_your_bill"
    }
}   
/**
 * ############################################ APPDATA END
 */

/**
 * APP START
 */

//DEBUG
var DEBUG = false;

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
    balloon = new Balloon(appData.balloons);

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

    keyboard.show([
        appData.keys[2],
        appData.keys[3]

    ], function(e) {

        keyboard.hide();
        if(e === "key-yes") {
            landingPage.style.display = "none";
            startGame();
        } else {
            d("go to home");
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
        //apply pixalate algorithm
        for(var x = 0; x < canvasW; x += blocksize) {
            for(var y = 0; y < canvasH; y += blocksize) {
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
/**
 * ############################################ APP END
 */
