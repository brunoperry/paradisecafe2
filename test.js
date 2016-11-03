
(function(window) {

    function Balloons(data) {

        var instance = this;

        this.balloonsData = data;

        var balloonsContext = document.getElementById("balloonsCanvas").getContext("2d");
    
        var images = [];

        for(b in instance.balloonsData) {
            Utils.getBallonImage(b, images);
        }

        this.clear = function() {

            balloonsContext.clearRect(0, 0, canvasW, canvasH);
        }

        this.justShowBalloon = function(balloon) {
            balloonsContext.drawImage(images[balloon], 0, 0, canvasW, canvasH);
        }

        this.showBalloon = function(balloon, callback, dontPause) {


            if(!dontPause) {
                wait = true;
            }

            instance.clear();

            if(balloon) balloonsContext.drawImage(images[balloon], 0, 0, canvasW, canvasH);

            setTimeout(function(e) {

                if(!dontPause) {
                    wait = false;
                } else {
                    instance.clear();
                }
                
                if(callback) callback();

            }, BALLON_TIME);
        };
    };

    window.Balloons = Balloons;

}(window));