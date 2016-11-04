var NORMAL_SPEED = 50;
var SPEED = NORMAL_SPEED;
var interval;


//Door
var door;


//canvas properties
var context;
var hudContext;
var canvas;
var vContext;
var vCanvas;
var canvasW;
var canvasH;



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

//balloons
var balloon;

//hud
var hud;

function init() {

    //setup render stuff
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    vCanvas = document.getElementById("virtual-canvas");
    vContext = vCanvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;

    //setup door object
    door = new Door(appData.door);

    //setup balloon
    balloon = new Balloon(appData.balloons);

    //setup hud
    hud = new HUD();

    //setup characters
    hero = new Hero(appData.characters[0]);
    police = new Police(appData.characters[1]);
    whore = new Whore(appData.characters[2]); 
    oldLady = new OldLady(appData.characters[3]); 
    thief = new Thief(appData.characters[4]); 

    //setup scenes
    splashScene = new SplashScene(appData.scenes[0]);
    mainScene = new MainScene(appData.scenes[1]);
    streetScene = new StreetScene(appData.scenes[2]);
    jailScene = new JailScene(appData.scenes[3]);
    brothelScene = new BrothelScene(appData.scenes[4]);
    paradiseCafeScene = new ParadiseCafeScene(appData.scenes[5]);

    //setup keyboard
    keyboard = new Keyboard();

    //prepare
    onResize();
}

function startGame() {

    //start
    // changeScenes(splashScene.name);
    changeScenes(streetScene.name);
}

function gameLoop() {

    clearCanvas();
    currentScene.update();
}

function clearCanvas(){

    context.clearRect(0, 0, canvasW, canvasH);
}
function render(image) {

    context.drawImage(image, 0, 0, canvasW, canvasH);
    if( currentScene.name !== splashScene.name && 
        currentScene.name !== mainScene.name && 
        currentScene.name !== jailScene.name) {
        hud.render();
    }
}

function changeScenes(sceneName) {

    if(currentScene) {

        clearCanvas();
        currentScene.disable();
    }

    switch(sceneName) {

        case splashScene.name:
        
        currentScene = splashScene;
        break;

        case mainScene.name:
        
        currentScene = mainScene;
        break;

        case streetScene.name:
        currentScene = streetScene;
        break;
        case jailScene.name:
        
        currentScene = jailScene;
        break;
        case brothelScene.name:
        
        currentScene = brothelScene;
        break;
        case paradiseCafeScene.name:
        
        currentScene = paradiseCafeScene;
        break;
    }

    currentScene.enable();
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

        startGame();
    }
}

function onResize() {
    canvasW = canvas.width;
    canvasH = canvas.height;
}

function d(message) {

    console.log(message);
    document.getElementById("debugger").innerHTML = message;
}

//EVENTS
window.onresize = function() {

    onResize();
}