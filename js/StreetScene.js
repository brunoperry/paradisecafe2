(function(window) {

    function StreetScene(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var sceneData = data;
        var images = sceneData.images;
        var anim = sceneData.animations.background;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.isReady = false;
        this.doTransition = true;
        this.id = sceneData.id;
        this.name = sceneData.name;
        this.showHUD = true;
        this.currentFrame;

        //ACTIONS STUFF
        var doCurrentAction;

        var actionDone = false;

        this.update = function() {

            if(!instance.isEnabled) return;

            doCurrentAction();
            render(instance.currentFrame);
        }

        var changeAction = function(action) {

            actionDone = false;

            switch(action) {

                case "street_action":
                doCurrentAction = streetAction;
                break;
                case "police_action":
                doCurrentAction = policeAction;
                break;
                case "whore_action":
                doCurrentAction = whoreAction;
                break;
                case "oldlady_action":
                doCurrentAction = oldLadyAction;
                break;
                case "thief_action":
                doCurrentAction = thiefAction;
                break;
                case "cafe_action":
                doCurrentAction = cafeAction;
                break;
            }
        }

        //ACTIONS
        var streetAction = function() {

            door.scroll();
            hero.walk();

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                hero.currentFrame
            ];
        }

        var cafeAction = function() {

            if(!door.isCafeDone) {

                hero.idleStreet("left");
                if(!door.isOpen) {

                    door.open();
                } else {

                    door.showParadiseCafe();

                    if(!keyboard.isVisible) {
                        keyboard.show([
                            appData.keys[7],
                            appData.keys[6],
                        ], function(e) {

                            if(e === "key-enter") {

                                changeScenes(paradiseCafeScene.name);
                            }
                            door.isCafeDone = true;
                            keyboard.hide();
                        });
                    }
                }
            } else {

                if(door.isOpen) {

                    door.close();
                } else {

                    door.isCafeDone = false;
                    door.setAction("street_action");
                    changeAction("street_action");
                }
            }
            
            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                hero.currentFrame,
            ];
        }

        var thiefAction = function() {

            if(!door.isOpen && !thief.isDone) {

                hero.idleStreet();
                door.open();

            } else if(!thief.isDone) {

                if(!thief.isShown) {
                    hero.idleStreet();
                    thief.show();
                } else {

                    if(thief.isAgressive) {

                        if(hero.wallet.hasGun) {

                            if(!hero.isDefending) {

                                thief.showGun();
                                balloon.showBalloon("thief_give_me_your_wallet", null, true);

                                if(!keyboard.isVisible) {

                                    keyboard.showTimedout([
                                        appData.keys[8]
                                    ], 3, function(e) {


                                        balloon.hideBalloon();
                                        if(e === "fail") {

                                            thief.isDone = true;
                                        } else {

                                            hero.isDefending = true;
                                        }

                                        keyboard.hide();
                                    });
                                }
                            } else {

                                hero.idleGun();

                                if(!thief.isHurt) {
                                    thief.hurt();
                                } else {

                                    balloon.showBalloon("thief_only_wanted_light");
                                    thief.isDone = true;
                                }
                            }
                            
                        } else {

                            thief.showGun();
                            balloon.showBalloon("thief_give_me_your_wallet");
                            thief.isDone = true;
                        }
                        
                    } else {

                        if(!thief.hasPulledCigar) {

                            thief.pullCigar();
                        } else {

                            if(!balloon.doneDialog) {

                                balloon.showDialog(["thief_got_light", "hero_dont_smoke"]);
                            } else {

                                thief.isDone = true;
                            }
                        }
                    }
                }
            } else {

                if(thief.isShown) {

                    if(thief.hasPulledCigar) {

                        thief.unpullCigar();
                    } else {

                        thief.hide();
                    }
                    
                } else {
                     
                     if(door.isOpen) {
                         
                         balloon.hideBalloon();
                         door.close();
                     } else {
                         
                        if(thief.isAgressive) {


                            var msg = "";
                            if(hero.wallet.hasGun && !thief.isHurt) {
                                msg = "hero_dont_have_gun";
                            } else if(!hero.wallet.hasGun) {
                                msg = "hero_shit";
                            }

                            if(msg !== "") {

                                hero.idleStreet("right");
                                balloon.showBalloon(msg, function() {
                                    hero.wallet.isStolen = true;
                                    hero.wallet.cash = 0;
                                    hero.wallet.points = 0;
                                });
                            } else {

                                hero.idleStreet();
                            }

                            if(thief.isHurt){
                                
                                hero.wallet.points += thief.scoreValue;
                            }
                        }

                        thief.reset();
                        balloon.doneDialog = false;
                        hero.isDefending = false;
                        door.setAction("street_action");
                        changeAction("street_action");
                     }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                thief.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        var oldLadyAction = function() {

            if(!actionDone) {

                if(!door.isOpen && !oldLady.isDone) {

                    hero.idleStreet();
                    door.open();
                } else if(!oldLady.isDone) {

                    if(!oldLady.isShown) {

                        hero.idleStreet();
                        oldLady.show();
                    } else if(oldLady.action === "") {

                        setSpeed(0);

                        keyboard.show([
                            appData.keys[4],
                            appData.keys[5],
                            appData.keys[6]
                            ], function(e) {

                                switch(e) {

                                    case "key-rape":
                                    oldLady.action = "rape";
                                    break;

                                    case "key-assault":
                                    oldLady.action = "assault";
                                    break;

                                    case "key-continue":

                                    hero.wallet.points += 1;
                                    oldLady.action = "hide";
                                    break;
                                }
                                setSpeed(NORMAL_SPEED);
                                keyboard.hide();
                            });
                    } else {

                        if(oldLady.action === "rape") {

                            if(hero.wallet.hasGun) {


                                if(!balloon.doneDialog) {

                                    hero.idleGun();
                                    balloon.showDialog(["hero_turn_around", "oldlady_ho_my_god"]);
                                } else {

                                    if(!oldLady.isBended && !hero.hasRaped) {

                                        balloon.hideBalloon();
                                        hero.idleStreet();
                                        oldLady.bend();
                                    } else {

                                        if(!hero.hasRaped) {
                                            hero.rape();

                                            if(hero.SEX_TICK === Math.round(hero.SEX_TICK / 2)) {
                                                balloon.showDialog(["oldlady_so_big", "hero_its_done"]);
                                            }
                                        } else {

                                            hero.idleStreet();

                                            if(oldLady.isBended) {

                                                oldLady.unbend();
                                            } else {

                                                balloon.showBalloon("oldlady_deserves100");
                                                hero.wallet.points += 100;
                                                oldLady.isDone = true;
                                            }
                                        }
                                    }
                                }

                            } else {
                                hero.idleStreet("right");
                                balloon.showBalloon("hero_no_gun");
                                oldLady.isDone = true;
                            }


                        } else if(oldLady.action === "assault") {

                            if(hero.wallet.hasGun) {

                                if(!balloon.doneDialog) {

                                    hero.idleGun();
                                    balloon.showDialog(["hero_this_is_a_robbery", "oldlady_ho_my_god"]);
                                } else {

                                    if(!hero.hasRobbed) {
                                        var spoils = oldLady.rob();
                                        balloon.showBalloon(spoils.message);
                                        hero.wallet.cash += spoils.value;
                                        hero.hasRobbed = true;

                                    } else {
                                        oldLady.isDone = true;
                                    }
                                }

                            } else {

                                hero.idleStreet("right");
                                balloon.showBalloon("hero_no_gun");
                                oldLady.isDone = true;
                            }


                        } else {

                            oldLady.isDone = true;
                        }
                    }
                } else {

                    hero.idleStreet();
                    if(oldLady.isShown) {

                        oldLady.hide();
                    } else {

                        if(door.isOpen) {

                            door.close();
                        } else {
                            oldLady.reset();
                            balloon.doneDialog = false;
                            hero.hasRaped = false;
                            hero.hasRobbed = false;
                            hero.SEX_TICK = 0;
                            door.setAction("street_action");
                            changeAction("street_action");
                            return;
                        }
                    }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                oldLady.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        var whoreAction = function() {

            if(!actionDone) {

                if(!door.isOpen && !whore.isDone) {

                    door.open();
                } else if(!whore.isDone){

                    if(!whore.isShown) {

                        hero.idleStreet("left");
                        whore.show();
                    } else {

                        if(!whore.hasAsked) {

                            var question = Utils.getRandomItem( balloon.getData("whore_street_question") );
                            balloon.showBalloon(question, null, true);
                            whore.hasAsked = true;

                            keyboard.show([
                                appData.keys[2],
                                appData.keys[3]
                                ], function(e) {

                                    if(e === "key-yes") {

                                        whore.action = "positive_call";
                                    }
                                    
                                    balloon.hideBalloon();
                                    keyboard.hide();
                                });
                        } else {

                            if(!whore.isDone) {

                                if(whore.action === "positive_call") {

                                    balloon.showBalloon("whore_come_on_then");
                                    whore.isDone = true;
                                    hero.resetTick();
                                } else {

                                    whore.isDone = true;
                                }
                            }
                        }
                    }
                } else {

                    if(whore.isShown) {

                        whore.hide();
                    } else {
                        if(whore.action === "positive_call" && !hero.hasEnteredBrothel) {

                            hero.enterBrothel();
                        } else {

                            if(door.isOpen) {
                                
                                door.close();
                            } else {
                                hero.hasShownDocs = false;

                                if(whore.action !== "positive_call") {

                                    balloon.showBalloon("hero_pussy");
                                    hero.idleStreet("right");
                                } else {


                                    changeScenes(brothelScene.name);
                                    hero.hasEnteredBrothel = false;
                                }
                                whore.reset();
                                door.setAction("street_action");
                                changeAction("street_action");
                            }
                        }
                    }
                }
            } 

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                whore.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }


        var policeAction = function() {

            if(!actionDone) {

                hero.idleStreet();

                if(!door.isOpen && !police.isDone) {
                    door.open();
                } else if(!police.isDone) {

                    if(!police.isShown) {

                        police.show();
                    } else {

                        if(police.isAgressive) {
                            
                            police.action();

                            if(!police.hasAsked) {
                                
                                balloon.showBalloon("police_ask_docs");
                                police.hasAsked = true;

                            } else {

                                if(hero.wallet.isStolen) {

                                    if(hero.hasShownDocs) {
                                        balloon.showBalloon("police_come_with_me", function() {
                                            changeScenes("jail_scene");
                                        });

                                    } else {
                                        balloon.showBalloon("hero_no_wallet");
                                        hero.hasShownDocs = true;
                                    }
                                } else {

                                    if(!hero.hasShownDocs) {
                                    hero.showDocs();
                                    hero.hasShownDocs = true;
                                    wait(1);

                                    } else {

                                        if(!police.isDone) {
                                            balloon.showBalloon("police_ok_you_can_go");
                                            police.isDone = true;
                                        }
                                    }
                                }
                            }

                        } else {

                            if(!police.hasAsked) {

                                balloon.showBalloon("police_how_its_going");
                                police.hasAsked = true;
                            } else {

                                if(!hero.hasShownDocs) {

                                    balloon.showBalloon("hero_everything_fine");
                                    hero.hasShownDocs = true;
                                } else {
                                    police.isDone = true;
                                }
                            }
                        }
                    }
                } else {

                    if(police.isShown) {

                        police.hide();
                    } else {

                        if(door.isOpen) {
                            
                            door.close();
                        } else {
                            police.reset();
                            hero.hasShownDocs = false;
                            door.setAction("street_action");
                            changeAction("street_action");
                        }
                    }
                }
            }

            instance.currentFrame = [
                images[anim[0]],
                door.currentFrame,
                police.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ];
        }

        this.enable = function() {

            document.body.style.backgroundColor = "blue";

            instance.isEnabled = true;

            door.enable();
            door.addEventListener(changeAction);
            hero.enable();
            police.enable();

            audioSource.addListener(function(e) {

                instance.isReady = true;
                audioSource.addListener(null);
            });
            audioSource.playClip(instance.id);
            setSpeed(NORMAL_SPEED);

            changeAction("street_action");
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isReady = false;
            actionDone = false;
            tick = 0

            door.disable();
            door.removeEventListener();
            hero.disable();
            police.disable();
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            sceneReady();
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(sceneData.images, imagesLoaded);
    }

    window.StreetScene = StreetScene;

}(window));