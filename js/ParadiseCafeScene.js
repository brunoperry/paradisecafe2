(function(window) {

    function ParadiseCafeScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var backgroundFrame;
        var backgroundInterval;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.bill = 20;
        this.showHUD = true;
        
        var isServed = false;
        var doDeal;

        var CAFE_TIMEOUT = Math.round((NORMAL_SPEED / 2) * 1.50);
        var CAFE_TICK = 0;

        //ACTIONS STUFF
        var doCurrentAction;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();

            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;

            switch(action) {

                case "idle_action":
                doCurrentAction = idleAction;
                keyboard.enablePermKey();
                waitress.reset();
                break;

                case "serve_action":
                doCurrentAction = serveAction;
                keyboard.disablePermKey();
                break;

                case "drink_action":
                doCurrentAction = drinkAction;
                keyboard.disablePermKey();
                break;

                case "deal_action":
                doCurrentAction = dealAction;
                keyboard.disablePermKey();
                dealer.reset();
                break;

                case "exit_action":
                doCurrentAction = exitAction;
                keyboard.disablePermKey();
                break;
            }

            if(hero.currentFrame === undefined) return;
        }

        var dealAction = function() {

            if(!dealer.isDone) {

                if(!dealer.isShown) {

                    dealer.show();
                } else {

                    if(!balloon.doneDialog) {
                        balloon.showDialog(dealer.deal.message);
                    } else {
                        var sellType = (dealer.deal.type === "sell");
                        var isValid = true;
                        if(sellType) {

                            if(hero.wallet.cash < parseInt(dealer.deal.value)) {

                                isValid = false;
                                balloon.showBalloon("hero_no_cash_cafe", function() {
                                    dealer.isDone = true;
                                });
                            }
                        }

                        if(dealer.isAction) {

                            if(keyboard.isVisible) {
                                keyboard.hide();
                            }

                            if(dealer.madeDeal) {

                                if(dealer.deal.type === "sell") {

                                    switch(dealer.deal.item) {

                                        case "wallet":
                                        hero.wallet.isStolen = false;
                                        break;
                                        case "gun":
                                        hero.wallet.hasGun = true;
                                        break;
                                        case "drug":
                                        hero.wallet.drugs += 1;
                                        break;
                                    }
                                    hero.wallet.cash -= parseInt(dealer.deal.value);
                                    
                                } else {
                                    hero.wallet.cash += parseInt(dealer.deal.value);
                                    hero.wallet.drugs -= 1;
                                }

                                balloon.showBalloon("hero_accept", function() {
                                    dealer.isDone = true;
                                });

                            } else {

                                balloon.showBalloon("hero_refuse", function() {
                                    dealer.isDone = true;
                                });
                            }
                        }

                        if(isValid && !keyboard.isVisible && !dealer.isAction) {
                            keyboard.show([
                                labelsData.keys[15],
                                labelsData.keys[16]
                            ], onKeyboardClick);
                        }
                    }
                }
            } else {

                if(dealer.isShown) {
                    dealer.hide();
                } else {
                    changeAction("idle_action");
                    balloon.doneDialog = false;
                }
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame,
                dealer.currentFrame,
                balloon.currentFrame
            ];
        }

        var exitAction = function () {

            if(!waitress.isDone) {

                if(!waitress.isShown) {

                    waitress.show();
                } else {

                    if(!waitress.hasServed) {

                        if(!balloon.isShowing) {
                            balloon.showBalloon("waitress_your_bill", null, true);
                            keyboard.show([
                                labelsData.keys[17]
                            ], function() {
                                keyboard.hide();
                                balloon.hideBalloon();
                                waitress.hasServed = true;
                            });
                        }
                        
                    } else {

                        if(instance.bill > hero.wallet.cash){
                            if(!balloon.doneDialog) {
                                balloon.showDialog(["hero_no_cash_cafe", "waitress_wait_there"]);
                            } else {
                                balloon.hideBalloon();
                                keyboard.hide();
                                changeScenes(jailScene.name);
                            }
                        } else {
                            hero.wallet.cash -= instance.bill;
                            waitress.isDone = true;
                        }
                    }
                }
            } else {

                keyboard.hide();
                waitress.hasServed = false;
                balloon.doneDialog = false;
                waitress.reset();
                changeScenes(streetScene.name);
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame,
                waitress.currentFrame,
                balloon.currentFrame
            ];
        }

        var drinkAction = function() {

            if(hero.hasDrink) {
                hero.drink();
            } else {

                changeAction("idle_action");
                hero.hasDrink = false;
            }

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame
            ];
        }

        var serveAction = function() {

            if(hero.hasDrink) {
                changeAction("drink_action");
            } else if(waitress.isDone) {
                changeAction("idle_action");
                hero.hasDrink = true;
                instance.bill += waitress.cost;
            } else {

                if(!waitress.isShown) {

                    waitress.show();
                } else {

                    if(!waitress.hasServed) {

                        waitress.serve();
                    } else {

                        waitress.hide();
                    }
                }
            }

            instance.currentFrame = [
                backgroundFrame,
                waitress.currentFrame,
                hero.currentFrame
            ];
        }

        var idleAction = function() {

            if(CAFE_TICK === CAFE_TIMEOUT) {

                doDeal = Math.random() < 0.5;

                if(doDeal) {

                    changeAction("deal_action");
                } else {

                    changeAction("serve_action");
                }
                CAFE_TICK = 0;
            } else {

                hero.idleCafe();
            }

            CAFE_TICK++;

            instance.currentFrame = [
                backgroundFrame,
                hero.currentFrame
            ];
        }

        var onKeyboardClick = function(e) {

            if(balloon.isShowing) {

                balloon.hideBalloon();
            }

            switch(e) {

                case "key-exit":
                changeAction("exit_action");
                keyboard.hidePerm();
                break;

                case "key-accept":
                dealer.isAction = true;
                dealer.madeDeal = true;
                break;

                case "key-refuse":
                dealer.isAction = true;
                dealer.madeDeal = false;
                break;
            }
        }

        var updateBackground = function () {

            if(tick >= anims.background.length) {
                tick = 0;
            }

            backgroundFrame = images[anims.background[tick]];

            tick++;
        }

        this.enable = function() {

            document.body.style.backgroundColor = "black";

            instance.isEnabled = true;

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            changeAction("idle_action");

            backgroundInterval = setInterval(updateBackground, NORMAL_SPEED * 50);

            keyboard.showPerm([
                labelsData.keys[14]
            ],onKeyboardClick);

            instance.bill = 20;
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
            backgroundInterval = clearInterval(backgroundInterval);
            backgroundInterval = null;
            isServed = false;
            CAFE_TICK = 0;
            hero.hasDrink = false;

            keyboard.hidePerm();

            instance.bill = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            backgroundFrame = images[anims.background[anims.background.length-1]];
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.ParadiseCafeScene = ParadiseCafeScene;

}(window));