//DEBUG
var DEBUG = true;

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
        changeScenes(mainScene.name);
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