(function(window) {

    function Utils() {};

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
    window.Utils = Utils;

} (window));