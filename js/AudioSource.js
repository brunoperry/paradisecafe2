(function(window) {

    function AudioSource() {

        var instance = this;
        var player = document.getElementById("audio-player");
        var clips = [];

        this.isOff = false;

        var init = function() {

            var srcs = player.getElementsByTagName("source");
            for(var i = 0; i < srcs.length; i++) {

                clips.push(srcs[i].src);
            }
        }

        this.enable = function() {

            if(isOff) {

                player.play();
            }

            isOff = false;
        }

        this.disable = function() {

            isOff = true;
            player.pause();
        }

        this.playClip = function(sceneID) {

            if(isOff) {
                return;
            }

            if(!player.paused && player.src !== clips[sceneID]) {

                player.pause();
            }
            
            if(player.src !== clips[sceneID]) {
                player.src = clips[sceneID];
                player.play();
            }
        }

        init();
    }

    window.AudioSource = AudioSource;

}(window));