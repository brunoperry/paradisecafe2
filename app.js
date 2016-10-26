var NORMAL_SPEED = 150;
var SPEED = NORMAL_SPEED;
var interval;

var splashScene;
var mainScene;
var currentScene;


//canvas properties
var context;
var canvas;
var canvasW;
var canvasH;

var numScenes = 0;

function init() {

    //setup render stuff
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvasW = canvas.width;
    canvasH = canvas.height;

    //setup scenes
    mainScene = new MainScene(appData.scenes[0]);
    splashScene = new SplashScene(appData.scenes[1]);

    //setup keyboard
    keyboard = new Keyboard();

    //prepare
    onResize();
}

function startGame() {

    //start
    changeScenes(mainScene.name);
    interval = setInterval(gameLoop, SPEED);
}

function gameLoop() {

    context.clearRect(0, 0, canvasW, canvasH);
    currentScene.update();
}

function changeScenes(sceneName) {

    if(currentScene) {
        currentScene.disable();
    }

    switch(sceneName) {

        case splashScene.name:
        
        currentScene = splashScene;
        break;

        case mainScene.name:
        
        currentScene = mainScene;
        break;
    }

    currentScene.enable();
}

function setSpeed(speed) {

    if(SPEED !== speed) {
        SPEED = speed;
    }

    if(interval) {

        clearInterval(interval);
        interval = null;
        interval = setInterval(gameLoop, SPEED);
    } 
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
}

//EVENTS
window.onresize = function() {

    onResize();
}