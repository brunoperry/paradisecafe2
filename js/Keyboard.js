(function(window) {

    function Keyboard() {

        //OBJECT PROPERTIES
        var instance = this;
        var callback;
        var permCallback;
        var keysContainer = document.getElementById("keys-container");
        var permKeyContainer = document.getElementById("perm-key-container");
        var keys;

        this.isVisible = false;

        var timeout;


        //OBJECT METHODS
        //build keys
        var buildKeys = function(data, container) {

            container.innerHTML = "";

            var key;
            var label;
            for(var i = 0; i < data.length; i++) {

                key = document.createElement("div");
                key.className = "keyboard-key";
                key.dataset.action = data[i].action;

                label = document.createElement("label");
                label.innerHTML = data[i].label;
                key.appendChild(label);

                container.appendChild(key);
            }

            keys = container.getElementsByClassName("keyboard-key");
            for(var i = 0; i < keys.length; i++) {
                keys[i].addEventListener("click", onKeyClick);
            }
        }

        //key click event
        var onKeyClick = function(e) {

            if(!callback) {
                permCallback(e.target.dataset.action);
            } else {
                callback(e.target.dataset.action);
            }
        }

        this.disablePermKey = function() {

            permKeyContainer.className = "disabled";
        }

        this.enablePermKey = function() {

            permKeyContainer.className = "";
        }

        //PUBLIC
        this.showPerm = function(data, icallback) {

            permCallback = icallback;

            //build key
            buildKeys(data, permKeyContainer);

            document.getElementById("keyboard-container").className = "slide-in";
        }
        this.hidePerm = function() {

            permKeyContainer.innerHTML = "";
            permCallback = null;
        }
        this.show = function(data, icallback) {

            callback = icallback;

            //build keys
            buildKeys(data, keysContainer);

            document.getElementById("keyboard-container").className = "slide-in";

            instance.isVisible = true;
        }

        this.showTimedout = function(data, tO, icallback) {

            callback = icallback;

            buildKeys(data, keysContainer);

            var cont = document.getElementById("keyboard-container");
            cont.className = "slide-in";

            instance.isVisible = true;

            var tick = tO;
            var btnLabel = cont.getElementsByClassName("keyboard-key")[0].getElementsByTagName("label")[0];
            var label = btnLabel.innerHTML;
            btnLabel.innerHTML = label + " " + tick.toString();
            timeout = setInterval(function() {

                tick--;

                if(tick === -1) {

                    clearInterval(timeout);
                    timeout = null;

                    callback("fail");  
                    return; 
                };
                btnLabel.innerHTML = label + " " + tick.toString();
            }, tO * 200);
        }

        this.hide = function() {

            if(!instance.isVisible) return;

            callback = null;
            document.getElementById("keyboard-container").className = "";

            for(var i = 0; i < keys.length; i++) {

                keys[i].removeEventListener("click", onKeyClick);
            }
            keysContainer.innerHTML = "";
            keys = null;
            instance.isVisible = false;

            if(timeout) {

                clearInterval(timeout);
                timeout = null;
            }
        }
    }

    window.Keyboard = Keyboard;

}(window));