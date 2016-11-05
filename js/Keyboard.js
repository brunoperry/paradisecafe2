(function(window) {

    function Keyboard() {

        //OBJECT PROPERTIES
        var instance = this;
        var callback;
        var keysContainer = document.getElementById("keys-container");
        var keys;

        this.isVisible = false;

        var timeout;


        //OBJECT METHODS
        //build keys
        var buildKeys = function(data) {

            keysContainer.innerHTML = "";

            var key;
            var label;
            for(var i = 0; i < data.length; i++) {

                key = document.createElement("div");
                key.className = "keyboard-key";
                key.dataset.action = data[i].action;

                label = document.createElement("label");
                label.innerHTML = data[i].label;
                key.appendChild(label);

                keysContainer.appendChild(key);
            }

            keys = keysContainer.getElementsByClassName("keyboard-key");
            for(var i = 0; i < keys.length; i++) {

                keys[i].addEventListener("click", onKeyClick);
            }
        }

        //key click event
        var onKeyClick = function(e) {
            callback(e.target.dataset.action);
        }

        //PUBLIC
        this.show = function(data, icallback) {

            callback = icallback;

            //build keys
            buildKeys(data);

            d("sds")
            document.getElementById("keyboard-container").className = "slide-in";

            instance.isVisible = true;
        }

        this.showTimedout = function(data, tO, icallback) {

            callback = icallback;

            buildKeys(data);

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