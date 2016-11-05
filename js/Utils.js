(function(window) {

    function Utils() {};

    Utils.loadImages = function(dataIn, callback) {

        var totalImages = 0;
        var dataOut = [];
        for(var i = 0; i < dataIn.length; i++) {
            dataOut[i] = new Image();
            // dataOut[i].crossOrigin = "anonymous";
            dataOut[i].onload = function() { 
                totalImages++;
                if(totalImages === dataIn.length && callback) {
                    callback(dataOut);
                }
            }
            dataOut[i].src = "media/images/" + dataIn[i] + ".png";
        }
    };

    Utils.getBalloonImage = function(dataIn, callback) {

        var totalImages = Object.keys(dataIn).length;
        var imagesLoaded = 0;
        var dataOut = [];

        for(balloon in dataIn) {
            dataOut[balloon] = new Image();
            dataOut[balloon].onload = function() {
                imagesLoaded++;
                if(imagesLoaded === totalImages) {
                    callback(dataOut);
                }
            }
            dataOut[balloon].src = "media/images/balloons_" + balloon + ".png";
        }
    }

    Utils.getRandomItem = function(data) {

        return data[Math.floor(Math.random() * data.length)];
    }

    Utils.mergeImages = function(images) {

        var img = new Image();

        for(var i = 0; i < images.length; i++) {
            vContext.drawImage(images[i], 0, 0, canvasW, canvasH);
        }

        img.src = vCanvas.toDataURL();
        return img;
    }
    window.Utils = Utils;

} (window));