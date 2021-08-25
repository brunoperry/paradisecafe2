class AudioSource {

    constructor() {

        this.player = new Audio();
        this.currentSrc = null;

        this.player.onended = async () => {
            await this.play(this.currentSrc);
        }

        this.mutedVolume = 0;
    }

    async play(src = null) {
        if (!src) return;

        if (!this.player.paused) {
            this.stop();
        }
        this.currentSrc = this.player.src = src;
        await this.player.play();
    }

    stop() {
        this.player.pause();
    }
    set volume(vol) {
        this.player.volume = vol;
    }

    mute() {
        if (this.mutedVolume === 0) {
            this.mutedVolume = this.player.volume;
            this.player.volume = 0;
        } else {
            this.player.volume = this.mutedVolume;
            this.mutedVolume = 0;
        }
    }
}