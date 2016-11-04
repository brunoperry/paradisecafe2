(function(window) {

    function HUD() {

        var instance = this;

        var canvas = document.getElementById("hud-canvas");
        var context = canvas.getContext("2d");
        context.font="24px Mono";
        context.fillStyle = "#ffffff";
        this.isEnbaled = false;

        this.render = function() {

            instance.clear();

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

            context.fillText("SCORE= " + score, 0, (canvasH - 20));
            context.fillText("DINHEIRO= " + cash, (canvasW - 153), (canvasH - 20));

            if(currentScene.name === brothelScene.name || currentScene.name === paradiseCafeScene.name) {

                var bill = currentScene.bill.toString();
                if(bill.length < 6) {
                    var str = "";
                    for(var i = 0; i < (6 - bill.length); i++) {
                        str += "0";
                    }
                    bill = str + bill;
                }
                context.fillText("DESPESA= " + bill, (canvasW - 143), (canvasH - 43));
            }
        }

        this.clear = function() {

            context.clearRect(0, 0, canvasW, canvasH);
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