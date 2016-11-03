(function(window) {

    function Balloon(data) {

        var BALLOON_TIMEOUT = 1000;

        var instance = this;
        var balloonsData = data;
        var images;

        var timeout;

        var isShowing = false;

        this.currentFrame;
        
        this.showBalloon = function(balloon, callback, keep) {

            instance.currentFrame = images[balloon];

            setSpeed(0);
            isShowing = true;

            if(callback) {
                
                timeout = setTimeout( function() {
                    
                    instance.hideBalloon();
                    callback();
                }, BALLOON_TIMEOUT);

            } else {

                d("asd:" + keep);

                if(!keep) timeout = setTimeout( instance.hideBalloon, BALLOON_TIMEOUT);
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

            if(isShowing) {
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
} (window))