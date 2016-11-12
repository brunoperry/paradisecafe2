<?php

include 'api.php';
$text = '';
$lang = getLang();
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Paradise Café2</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <link rel="tab icon" type="image/png" href="favico.png"/>
    <link rel="manifest" href="/manifest.json">
    <link href="styles.min.css" media="screen" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="labelsData_<?php echo $lang; ?>.json.js"></script>    
    <script type="text/javascript" src="appData.json.js"></script>
    <script type="text/javascript" src="script.min.js"></script>
  </head>
  <body onload="init();" data-lang="ENG">

  <div id="landing-page">

    <div class="container">
      <h1>PARADISE CAFÉ 2 / REMASTERED</h1>

      <?php
      $text = ($lang == 'PT') ? 'INTERDITO A MENORES DE IDADE!' : 'ADULTS ONLY 18+';
      ?>
      <span><?php echo $text; ?></span>

      <?php
      $text = ($lang == 'PT') ? 'Tem mais de 17 anos?' : 'You must be 18 or over to enter.';
      ?>
      <p id="age-question"><br><?php echo $text; ?></p>
    </div>
  </div>

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
        <div id="perm-key-container" class="spacer"></div>
        <div id="keyboard-container">
          <div id="keys-container"></div>
          <div class="spacer"></div>
        </div>
      </div>

    </div>

    <input id="name-input" type="input" maxlength="3" placeholder="NOME">

    <div id="side-menu">
      <div id="side-menu-container">
        <h1>PARADISE CAFÉ</h1>
        <ul>

        <?php
        $text = ($lang == 'PT') ? 'Música [X]' : 'Music [X]';
        ?>
          <li class="side-menu-item" data-action="mute"><?php echo $text; ?></li>
          <li data-action="speed">

        <?php
        $text = ($lang == 'PT') ? 'Velocidade:' : 'Speed:';
        echo $text;
        ?>
            <br>
            <div id="speed-container" class="flexed">
              <div class="side-menu-item" data-action="slow" data-value="300">0.5x[ ]</div>
              <div class="side-menu-item" data-action="normal" data-value="150">1x[X]</div>
              <div class="side-menu-item" data-action="turbo" data-value="50">Turbo[ ]</div>
            </div>
          </li>

        <?php
        $text = ($lang == 'PT') ? 'Acerca' : 'About';
        ?>
          <li class="side-menu-item" data-action="about"><?php echo $text; ?></li>

        <?php
        $text = ($lang == 'PT') ? 'Sair' : 'Exit';
        ?>
          <li class="side-menu-item" data-action="exit"><?php echo $text; ?></li>

        <?php
        $text = ($lang == 'PT') ? 'Fechar>>' : 'Close Menu>>';
        ?>
          <li class="side-menu-item" data-action="close"><?php echo $text; ?></li>
        </ul>
      </div>
    </div>
  </div>

  <div id="debugger">C.C.2016</div>

  <audio id="audio-player" preload="none" oncanplaythrough="audioSource.onAudioCanPlayThrough();">
    <source src="media/sounds/splash_track.mp3" type="audio/mp3">
    <source src="media/sounds/main_track.mp3" type="audio/mp3">
    <source src="media/sounds/streets_track.mp3" type="audio/mp3">
    <source src="media/sounds/jail_track.mp3" type="audio/mp3">
    <source src="media/sounds/brothel_track.mp3" type="audio/mp3">
    <source src="media/sounds/paradisecafe_track.mp3" type="audio/mp3">
  </audio>

  <script>
  </body>
</html>
