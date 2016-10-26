(function(window) {

    function Keyboard() {

        //OBJECT PROPERTIES
        var instance = this;
        var callback;
        var keysContainer = document.getElementById("keys-container");


        //OBJECT METHODS
        //build keys
        var buildKeys = function(data) {

            keysContainer.innerHTML = "";

            var key;
            for(var i = 0; i < data.length; i++) {

                key = document.createElement("div");
                key.className = "keyboard-key";
                key.dataset = data[i].action;
                key.innerHTML = data[i].label;

                keysContainer.appendChild(key);
            }

        }

        //PUBLIC
        this.show = function(data, icallback) {

            callback = icallback;

            //build keys
            buildKeys(data);

            document.getElementById("keyboard-container").className = "slide-in";
        }

        this.hide = function() {

            callback = null;

            document.getElementById("keyboard-container").className = "";
        }
    }

    window.Keyboard = Keyboard;

}(window));