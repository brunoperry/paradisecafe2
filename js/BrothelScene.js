(function(window) {

    function BrothelScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anims = sceneData.animations;
        var tick = 0;
        var SEX_TIMEOUT = Math.round((NORMAL_SPEED / 3) * 1.50);
        var SEX_TICK = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.currentFrame;
        this.bill = 0;
        this.showHUD = true;

        //ACTIONS STUFF
        var doCurrentAction;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();

            instance.currentFrame = [
                images[anims.background[0]],
                whore.currentFrame,
                hero.currentFrame,
                pimp.currentFrame,
                balloon.currentFrame
            ];

            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;
            SEX_TICK = 0;

            switch(action) {

                case "idle_action":
                doCurrentAction = idleAction;
                break;
                case "sex_action":
                doCurrentAction = sexAction;
                break;
                case "anal_action":
                doCurrentAction = analAction;
                break;
                case "oral_action":
                doCurrentAction = oralAction;
                break;
                case "pimp_action":
                doCurrentAction = pimpAction;
                break;
            }
        }

        var analAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_eat_your_ass");
                hero.isFucking = true;
            } else {
                whore.anal();
                hero.anal();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === Math.round(v)) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("whore_so_thick", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_aaa", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var sexAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_eat_your_pussy");
                hero.isFucking = true;
            } else {
                whore.sex();
                hero.sex();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_im_coming", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var oralAction = function() {

            if(!hero.isFucking) {

                balloon.showBalloon("hero_do_me_blowjob");
                hero.isFucking = true;
            } else {
                whore.oral();
                hero.oral();

                var v = Math.round(SEX_TIMEOUT / 3);

                if(SEX_TICK === Math.round(v)) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_suck_it_all", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(SEX_TICK === SEX_TIMEOUT - v) {
                    if(!balloon.isShowing) {
                        balloon.justShowBalloon("hero_so_good", function() {
                            SEX_TICK++;
                        });
                    }
                } else if(!balloon.isShowing) {
                    SEX_TICK++;
                }

                if(SEX_TICK === SEX_TIMEOUT) {
                    hero.hasFucked = true;
                }
            }

            if(hero.hasFucked) {
                changeAction("idle_action");
            }
        }

        var pimpAction = function() {

            whore.idleBrothel();
            hero.idleBrothel();

            if(!whore.hasAsked) {

                balloon.showBalloon("hero_no_cash_brothel");
                whore.hasAsked = true;
                
            } else {

                if(!pimp.isAction) {
                    if(!pimp.hasStarted) {
                    
                        balloon.showBalloon("whore_call_pimp");
                        pimp.hasStarted = true;

                    } else {

                        if(!pimp.isShown) {
                            pimp.show();
                        } else {

                            balloon.showBalloon("pimp_hello");
                            pimp.isAction = true;
                        }
                    }

                } else {

                    if(!pimp.isRaping) {

                        if(!balloon.doneDialog) {
                            pimp.idle();
                            balloon.showDialog(["pimp_whats_going_on", "whore_this_no_pay", "pimp_he_will_see"]);
                        } else {

                            pimp.isRaping = true;
                            balloon.hideBalloon();
                        }
                        
                    } else {

                        SEX_TICK++;

                        if(SEX_TICK === SEX_TIMEOUT - Math.round(SEX_TIMEOUT / 4)) {
                            balloon.justShowBalloon("hero_what_a_dick");
                        }

                        if(SEX_TICK === SEX_TIMEOUT){

                            pimp.reset();
                            hero.wallet.points = 0;
                            hero.wallet.cash = 0;
                            changeScenes(streetScene.name);
                        }

                        whore.idleBrothel();
                        hero.bend();
                        pimp.rape();
                    }
                }
            }
        }

        var idleAction = function() {

            whore.idleBrothel();
            hero.idleBrothel();

            if(hero.hasFucked) {

                if(!whore.hasAsked) {

                    balloon.showBalloon("whore_cost_" + whore.cost.toString(), null, true);
                    whore.hasAsked = true;
                    instance.bill = whore.cost;

                    if(!keyboard.isVisible) {

                        keyboard.show([
                            appData.keys[14]

                        ], function(e) {

                            balloon.hideBalloon();
                            if(hero.wallet.cash < instance.bill) {
                                whore.hasAsked = false;

                                changeAction("pimp_action");
                            } else {
                                hero.wallet.cash -= instance.bill;
                                hero.wallet.points += whore.power;
                                changeScenes(streetScene.name);
                            }
                            keyboard.hide();
                        });
                    }
                }

            } else {
                balloon.showBalloon("whore_what_you_want", null, true);
                keyboard.show([
                    appData.keys[11],
                    appData.keys[12],
                    appData.keys[13]
                ], onKeyPress);
            }
        }

        var onKeyPress = function(e) {

            balloon.hideBalloon();
            switch(e) {
                case "key-oral":
                changeAction("oral_action");
                break;
                case "key-sex":
                changeAction("sex_action");
                break;
                case "key-anal":
                changeAction("anal_action");
                break;
            }

            keyboard.hide();
        }

        this.enable = function() {

            document.body.style.backgroundColor = "#bd00bd";

            instance.isEnabled = true;

            hero.enable();
            whore.enable();

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            changeAction("idle_action");
            instance.bill = 0;
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            tick = 0;
            instance.bill = 0;
            hero.isFucking = false;
            hero.hasFucked = false;
            whore.disable();
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.BrothelScene = BrothelScene;

}(window));