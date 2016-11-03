(function(window) {

    function Balloon(data) {

        var BALLOON_TIMEOUT = 1000;

        var instance = this;
        var balloonsData = data;
        var images;

        var timeout;

        var isShowing = false;

        this.currentFrame;

        var imagesReady = function(data) {
            images = data;
            instance.currentFrame = images.empty;
        }
        
        this.showBalloon = function(balloon, callback) {

            instance.currentFrame = images[balloon];

            setSpeed(0);
            isShowing = true;

            if(callback) {
            
                timeout = setTimeout( function() {
                    
                    instance.hideBalloon();
                    callback();
                }, BALLOON_TIMEOUT);

            } else {

                timeout = setTimeout( instance.hideBalloon, BALLOON_TIMEOUT);
            }
        };

        this.hideBalloon = function() {

            isShowing = false;
            setSpeed(NORMAL_SPEED);

            instance.currentFrame = images.empty;
        }

        this.pause = function() {

            clearTimeout(timeout);
            timeout = null;
        }

        this.resume = function() {

            if(isShowing) {
                timeout = setTimeout( instance.hideBalloon, BALLOON_TIMEOUT);
            }
        }

        Utils.getBalloonImage(balloonsData, imagesReady);
    }

    window.Balloon = Balloon;
} (window))