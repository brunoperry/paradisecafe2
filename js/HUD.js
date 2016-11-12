(function(window) {

    function HUD() {

        var instance = this;
        this.isEnabled = false;
        var currentFrame = new Image();

        var stateIcons = appData.hud.states;
        var images;

        this.getRender = function() {

            if(!instance.isEnabled) return;

            render();
            currentFrame.src =  hudCanvas.toDataURL();

            return currentFrame;
        }

        this.render = function() {

            if(!instance.isEnabled) return;

            var score = hero.wallet.points.toString();
            if(score.length < 6) {
                var str = "";
                for(i = 0; i < (6 - score.length); i++) {
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

            context.font = "20px Mono";
            context.fillText(labelsData.HUD.score + score, 0, (canvasH - 20));
            var text = context.measureText(labelsData.HUD.cash + cash + "$");
            context.fillText(labelsData.HUD.cash + cash + "$", (canvasW - text.width), (canvasH - 20));
            context.fillText(labelsData.HUD.drugs + hero.wallet.drugs, 0, (canvasH)- 5);

            if(currentScene.name === brothelScene.name || currentScene.name === paradiseCafeScene.name) {

                var bill = currentScene.bill.toString();
                if(bill.length < 6) {
                    var str = "";
                    for(var i = 0; i < (6 - bill.length); i++) {
                        str += "0";
                    }
                    bill = str + bill;
                }
                context.font = "24px Mono";
                text = context.measureText(labelsData.HUD.bill + bill + "$");
                context.fillText(labelsData.HUD.bill + bill + "$", (canvasW - text.width), (canvasH - 40));
            }

            if(hero.wallet.isStolen) {
                context.drawImage(images[stateIcons.wallet_off], 0, 0, canvasW, canvasH);
            } else {
                context.drawImage(images[stateIcons.wallet_on], 0, 0, canvasW, canvasH);
            }

            if(hero.wallet.hasGun) {
                context.drawImage(images[stateIcons.gun_on], 0, 0, canvasW, canvasH);
            } else {
                context.drawImage(images[stateIcons.gun_off], 0, 0, canvasW, canvasH);
            }
        }

        this.enable = function() {

            instance.isEnabled = true;
        }

        this.disable = function() {

            instance.isEnabled = false;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.enable();
        }

        //LOAD HUD IMAGES
        Utils.loadImages(appData.hud.images, imagesLoaded);
    }

    window.HUD = HUD;

}(window));