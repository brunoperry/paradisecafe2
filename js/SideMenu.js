(function(window) {

    function SideMenu() {

        var instance = this;
        var container = document.getElementById("side-menu-container");
        var btns = container.getElementsByClassName("side-menu-item");
        var hamburgerBtn = document.getElementById("menu-button");
        var isOpened = false;

        var currentSpeedButton;

        var init = function() {

            //HAMBURGER BUTTON EVENT SETUP
            hamburgerBtn.addEventListener("click", openClose);

            //LIST BUTTONS EVENT SETUP
            for(var i = 0; i < btns.length; i++) {

                btns[i].addEventListener("click", onMenuClick);
            }

            var sc = document.getElementById("speed-container").getElementsByClassName("side-menu-item");
            for(var i = 0; i < sc.length; i++) {

                if(sc[i].innerHTML.search("[X]") !== -1) {
                    currentSpeedButton = sc[i];
                    return;
                }   
            }
        }

        var openClose = function() {

            isOpened = !isOpened;

            if(isOpened) {
                setSpeed(0);
                container.className = "slide-in";
            } else {

                setSpeed(NORMAL_SPEED);
                container.className = "";
            }

            if(audioSource.isEnabled) {

                if(isOpened) {
                    audioSource.setVolume(0.2);
                } else {
                    audioSource.setVolume(1.0);
                }
            }
        }

        var onMenuClick = function(e) {

            switch(e.target.dataset.action) {

                case "mute":
                if(audioSource.isEnabled) {
                    audioSource.disable();
                    e.target.innerHTML = e.target.innerHTML.replace("[X]", "[ ]");
                } else {
                    audioSource.enable();
                    e.target.innerHTML = e.target.innerHTML.replace("[ ]", "[X]");
                }
                
                break;

                case "exit":
                    changeScenes(mainScene.name);
                break;

                case "slow":
                case "normal":
                case "turbo":

                currentSpeedButton.innerHTML = currentSpeedButton.innerHTML.replace("[X]", "[ ]");
                currentSpeedButton = e.target;
                currentSpeedButton.innerHTML = currentSpeedButton.innerHTML.replace("[ ]", "[X]");
                NORMAL_SPEED = parseFloat(currentSpeedButton.dataset.value);
                SPEED = NORMAL_SPEED;

                break;
            }

            hamburgerBtn.click();
        }

        this.enable = function() {

            hamburgerBtn.style.display = "block";
        }

        this.disable = function() {

            hamburgerBtn.style.display = "none";
        }

        init();
    }

    window.SideMenu = SideMenu;


}(window));