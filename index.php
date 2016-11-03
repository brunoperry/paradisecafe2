<!DOCTYPE html>
<html>
  <head>
    <title>Paradise Café2</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <link href="styles.css" media="screen" rel="stylesheet" type="text/css">
  </head>
  <body onload="init();">


  <div id="main-container">

    <div id="top-container">

      <div id="menu-button"></div>

    </div>

    <div id="mid-container">

      <canvas id="canvas" width="256" height="192"></canvas>
      <canvas id="virtual-canvas" width="256" height="192"></canvas>

    </div>

    <div id="bottom-container">
      <div id="keyboard">

        <div id="keyboard-container">
          <div id="keys-container"></div>
          <div id="perm-key-container"></div>

        </div>
      </div>

    </div>
  </div>

  <div id="debugger">DEBUGGER</div>

    
   
  </body>

  <script type="text/javascript" src="js/Utils.js"></script>
  <script type="text/javascript" src="js/Keyboard.js"></script>
  <script type="text/javascript" src="js/Balloon.js"></script>
  <script type="text/javascript" src="js/Door.js"></script>
  <script type="text/javascript" src="js/Hero.js"></script>
  <script type="text/javascript" src="js/Police.js"></script>
  <script type="text/javascript" src="js/SplashScene.js"></script>
  <script type="text/javascript" src="js/MainScene.js"></script>
  <script type="text/javascript" src="js/StreetScene.js"></script>
  <script type="text/javascript" src="js/JailScene.js"></script>
  <script type="text/javascript" src="appData.json.js"></script>
  <script type="text/javascript" src="app.js"></script>
</html>
