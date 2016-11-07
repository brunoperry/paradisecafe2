(function(window) {

    function Dealer(data) {

        //OBJECT PROPERTIES
        var instance = this;
        var dealerData = data;
        var images;
        var anims = dealerData.animations;
        var tick = 0;

        //PUBLIC
        this.isEnabled = false;
        this.name = dealerData.name;
        this.currentFrame;

        this.isDone = false;
        this.isShown = false;
        this.hasStarted = false;
        this.isAction = false;
        this.madeDeal = false;


        var dealValues = [300, 500, 1000, 5000];

        this.deal = {

            type: "sell",
            value: 200,
            message: [],
            item: ""
        }

        this.update = function() {

            if(!instance.isEnabled) return;
        }

        this.show = function() {

            if(tick >= anims.show.length) {

                tick = 0;
                instance.isShown = true;
                return;
            }
            instance.currentFrame = images[anims.show[tick]];

            tick++;
        }

        this.hide = function() {

            if(tick >= anims.hide.length) {

                tick = 0;
                instance.isShown = false;
                return;
            }
            instance.currentFrame = images[anims.hide[tick]];

            tick++;
        }

        this.idle = function() {
            instance.currentFrame = images[anims.idle[0]];
        }

        this.enable = function() {

            instance.isEnabled = true;
            instance.currentFrame = images[anims.show[0]];
        }

        this.reset = function() {

            instance.disable();
            generateDeal();
            instance.isAction = false;
            instance.madeDeal = false;
            instance.enable();
        }

        var generateDeal = function() {

            instance.deal.type = "";
            instance.deal.value = -1;
            instance.deal.message = [];
            instance.deal.item = "";

            if(hero.wallet.isStolen) {

                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "wallet";
                instance.deal.message = ["dealer_got_wallet", "dealer_accept_" + instance.deal.value];

                return;
            }

            if(!hero.wallet.hasGun) {

                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "gun";
                instance.deal.message = ["dealer_got_gun", "dealer_accept_" + instance.deal.value];

                return;
            }

            var sell = true;
            if(parseInt(hero.wallet.drugs) > 0) {

                sell = Math.random() < 0.5;
            }

            if(sell) {
                
                instance.deal.type = "sell";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "drug";
                instance.deal.message = [("dealer_got_" + Utils.getRandomItem(dealerData.drugs_avail)), ("dealer_accept_" + instance.deal.value)];

            } else {
                instance.deal.type = "buy";
                instance.deal.value = Utils.getRandomItem(dealValues);
                instance.deal.item = "";
                instance.deal.message = ["dealer_know_you_got_drugs", ("dealer_offer_" + instance.deal.value)];
            }
            
            d(instance.deal.value)
        }

        this.disable = function() {

            instance.isEnabled = false;
            instance.isDone = false;
            instance.isShown = false;
            instance.hasStarted = false;
            instance.isAction = false;
            tick = 0;
        }

        //EVENTS
        var imagesLoaded = function(data) {

            images = data;
            instance.currentFrame = images[anims.show[0]];
        }

        //LOAD SCENE IMAGES
        Utils.loadImages(dealerData.images, imagesLoaded);
    }

    window.Dealer = Dealer;

}(window));