(function(window) {

    function Utils() {};

    Utils.getAPI = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('GET', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }

    Utils.loadImages = function(dataIn, callback) {

        var totalImages = 0;
        var dataOut = [];
        for(var i = 0; i < dataIn.length; i++) {
            dataOut[i] = new Image();
            dataOut[i].crossOrigin = "anonymous";
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

        for(var balloon in dataIn) {

            if (dataIn.hasOwnProperty(balloon)) {

                dataOut[balloon] = new Image();
                dataOut[balloon].onload = function() {
                    imagesLoaded++;
                    if(imagesLoaded === totalImages) {
                        callback(dataOut);
                    }
                }
                dataOut[balloon].src = "media/images/balloons_" + dataIn[balloon] + ".png";
            }
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

    Utils.getScores = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('GET', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }
    Utils.setScore = function(apiRoute, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', dataHandler);
        request.open('POST', apiRoute);
        request.send();
        
        function dataHandler() {
            callback(this.responseText);
        }
    }
    window.Utils = Utils;

} (window));