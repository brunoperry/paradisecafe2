(function(window) {

    function HUD() {

        var instance = this;

        var hudCanvas = document.getElementById("hud-canvas");
        // var hudCanvas = document.createElement("canvas");
        hudCanvas.width = canvasW;
        hudCanvas.height = canvasH;
        var hudContext = hudCanvas.getContext("2d");
        hudContext.font="24px Mono";
        hudContext.fillStyle = "#ffffff";
        this.isEnbaled = false;
        var currentFrame = new Image();

        this.getRender = function() {

            render();
            currentFrame.src =  hudCanvas.toDataURL();

            return currentFrame;
        }

        var render = function() {

            d("render")
            instance.clear();

            hudContext.fillText("SCORE= ", 0, canvasH);


            return;

            var score = hero.wallet.points.toString();
            if(score.length < 3) {
                var str = "";
                for(i = 0; i < (3 - score.length); i++) {
                    str += "0";
                }
                score = str + score;
            }

            var cash = hero.wallet.cash.toString();
            if(cash.length < 6) {
                var str = "";
                for(var i = 0; i < (6 - cash.length); i++) {
                    str += "0";
                }
                cash = str + cash;
            }

            hudContext.fillText("SCORE= " + score, 0, (canvasH - 20));
            hudContext.fillText("DINHEIRO= " + cash, (canvasW - 153), (canvasH - 20));

            if(currentScene.name === brothelScene.name || currentScene.name === paradiseCafeScene.name) {

                var bill = currentScene.bill.toString();
                if(bill.length < 6) {
                    var str = "";
                    for(var i = 0; i < (6 - bill.length); i++) {
                        str += "0";
                    }
                    bill = str + bill;
                }
                hudContext.fillText("DESPESA= " + bill, (canvasW - 143), (canvasH - 43));
            }
        }

        this.clear = function() {

            hudContext.clearRect(0, 0, canvasW, canvasH);
        }

        this.enable = function() {

            instance.isEnbaled = true;
        }

        this.disable = function() {

            instance.isEnbaled = false;
        }
    }

    window.HUD = HUD;

}(window));