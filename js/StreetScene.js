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
        this.name = sceneData.name;
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

            switch(action) {

                case "street_action":
                doCurrentAction = streetAction;
                break;
                case "police_action":
                doCurrentAction = policeAction;
                break;
            }
        }

        //ACTIONS
        var streetAction = function() {

            door.scroll();
            hero.walk();

            instance.currentFrame = Utils.mergeImages([
                images[anim[0]],
                door.currentFrame,
                hero.currentFrame
            ]);
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

                                    if(police.isDone) {
                                        balloon.showBalloon("police_come_with_me", function() {
                                            changeScenes("jail_scene");
                                        });

                                    } else {
                                        balloon.showBalloon("hero_no_wallet");
                                        police.isDone = true;
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
                                ballon.showBalloon("hero_everything_ok");
                            }
                        }
                    }
                } else {

                    if(police.isShown) {

                        police.hide();
                    } else {
                            d(door.isOpen)

                        if(door.isOpen) {
                            
                            door.close();
                        } else {
                            actionDone = true;
                        }
                    }
                }
            }

            instance.currentFrame = Utils.mergeImages([
                images[anim[0]],
                door.currentFrame,
                police.currentFrame,
                hero.currentFrame,
                balloon.currentFrame
            ]);
        }

        this.enable = function() {

            document.body.style.backgroundColor = "blue";

            instance.isEnabled = true;
            setSpeed(NORMAL_SPEED);

            door.enable();
            door.addEventListener(changeAction);
            hero.enable();
            police.enable();

            changeAction("street_action");
        }

        this.disable = function() {

            instance.isEnabled = false;
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