(function(window) {

    function AudioSource() {

        var instance = this;
        var player = document.getElementById("audio-player");
        var clips = [];
        var currentAudio;
        var loadedCallback = null;

        var isOff = false;
        this.isEnabled = true;

        var init = function() {
            var srcs = player.getElementsByTagName("source");
            for(var i = 0; i < srcs.length; i++) {
                clips.push(srcs[i].src);
            }
            player.preload = "auto";
        }

        this.onAudioCanPlayThrough = function(e) {
            if(loadedCallback) {
                loadedCallback();
            }
        }

        this.addListener = function(listener) {
            loadedCallback = listener;
        }

        this.setVolume = function(vol) {
            player.volume = vol;
        }

        this.enable = function() {
            if(isOff) {
                player.pause();
                player.src = currentAudio;
                player.play();
            }
            isOff = false;
            instance.isEnabled = true;
        }

        this.disable = function() {
            isOff = true;
            player.pause();
            instance.isEnabled = false;
        }

        this.getSourceFromSceneID = function(sceneID) {
            return clips[sceneID];
        }

        this.playClip = function(sceneID) {
            currentAudio = clips[sceneID];
            if(isOff) {
                if(loadedCallback) {
                    loadedCallback();
                }
                return;
            }
            if(!player.paused && player.src !== currentAudio) {
                player.pause();
            }
            if(player.src !== currentAudio) {
                player.src = currentAudio;
                player.play();
            } else if(loadedCallback) {
                loadedCallback();
            }
        }
        init();
    }

    window.AudioSource = AudioSource;

}(window));