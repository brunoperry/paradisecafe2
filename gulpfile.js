const gulp = require('gulp');

const concat = require('gulp-concat');
const terser = require('gulp-terser');

const postCSS = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const JS_PATH = 'js/**/*.js';

const { src, series, parallel, dest, watch } = require('gulp');

const htmlTask = e => {
    return src('*.html').pipe(gulp.dest('dist'))
}

const jsTask = e => {
    return src([
        'js/Resources.js',
        'js/bin/Utils.js',
        'js/bin/components/Component.js',
        'js/bin/components/Door.js',
        'js/bin/components/Keyboard.js',
        'js/bin/components/AudioSource.js',
        'js/bin/components/Background.js',
        'js/bin/components/HUD.js',
        'js/bin/components/Loader.js',
        'js/bin/components/Renderer.js',
        'js/bin/components/Balloon.js',
        'js/bin/components/Controller.js',
        'js/bin/components/SwipeDoor.js',
        'js/bin/components/Menu.js',
        'js/bin/scenes/Scene.js',
        'js/bin/scenes/LandingScene.js',
        'js/bin/scenes/SplashScene.js',
        'js/bin/scenes/MainScene.js',
        'js/bin/scenes/ScoresScene.js',
        'js/bin/scenes/StreetScene.js',
        'js/bin/scenes/ParadiseCafeScene.js',
        'js/bin/scenes/CrackhouseScene.js',
        'js/bin/scenes/BrothelScene.js',
        'js/bin/scenes/JailScene.js',
        'js/bin/scenes/NewScoreScene.js',
        'js/bin/characters/Character.js',
        'js/bin/characters/Hero.js',
        'js/bin/characters/Thief.js',
        'js/bin/characters/Whore.js',
        'js/bin/characters/Scout.js',
        'js/bin/characters/OldLady.js',
        'js/bin/characters/Police.js',
        'js/bin/characters/Pimp.js',
        'js/bin/characters/Waiter.js',
        'js/bin/characters/Dealer.js',
        'js/bin/characters/Junkie.js',
        'js/Game.js',
        'js/app.js'
    ])
        .pipe(concat('paradisecafe.js'))
        .pipe(terser())
        .pipe(dest('dist'));
}
const cssTask = e => {
    return src('paradisecafe.css')
        .pipe(postCSS([autoprefixer(), cssnano()]))
        .pipe(dest('dist'))
}

exports.htmlTask = htmlTask;
exports.jsTask = jsTask;
exports.cssTask = cssTask;

