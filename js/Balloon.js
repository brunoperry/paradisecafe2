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
} (window))