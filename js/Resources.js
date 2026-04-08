class Resources {
  static async init(data) {
    return new Promise(async (resolve, reject) => {
      Resources.scoresData = data.scores;
      let highest = 0;
      for (let i = 0; i < Resources.scoresData.length; i++) {
        const scr = parseInt(Resources.scoresData[i].score);
        if (scr > highest) highest = scr;
      }
      Resources.HIGH_SCORE = highest;

      try {
        const images = data.media.images.children;
        const audios = data.media.audios.children;
        let loadedImages = 0;
        let loadedAudios = 0;
        const totalImages = images.length;
        const totalAudios = audios.length;

        // Load images and audios fully in parallel
        await Promise.all([
          Promise.all(
            images.map((image) =>
              fetch(image.path)
                .then((r) => r.blob())
                .then((blob) => createImageBitmap(blob))
                .then((bitmap) => {
                  image.imageData = bitmap;
                  loadedImages++;
                  Loader.update({
                    text: "loading images",
                    value: loadedImages / totalImages,
                  });
                }),
            ),
          ),
          Promise.all(
            audios.map((audio) =>
              fetch(audio.path)
                .then((r) => r.blob())
                .then((blob) => {
                  audio.audioData = window.URL.createObjectURL(blob);
                  loadedAudios++;
                  Loader.update({
                    text: "loading audios",
                    value: loadedAudios / totalAudios,
                  });
                }),
            ),
          ),
        ]);

        Resources.imagesData = images;
        Resources.audioData = audios;
        Resources.initialized = true;
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(new Error("Error loading assets!"));
      }
    });
  }

  static getImages(from = null) {
    if (!from) return Resources.imagesData;
    return Resources.imagesData.filter((img) => img.name.includes(`${from}_`));
  }

  static getImage(imageName) {
    return Resources.imagesData.find((img) => img.name.includes(imageName));
  }

  static getTrack(trackName) {
    return Resources.audioData.find((img) => img.name.includes(trackName));
  }

  static resetPlayerInventory() {
    Resources.PLAYER_INVENTORY = {
      wallet: true,
      gun: false,
      cash: 30,
      points: 0,
      drugs: 0,
      expense: null,
    };
  }
}
Resources.DIALOG_SPEED = 1000;
Resources.imagesData = null;
Resources.audioData = null;
Resources.labelsData = null;
Resources.scoresData = null;

Resources.VERIFY_AGE_LINK = "https://www.youtube.com/watch?v=Yzvr9nww1gg";
Resources.initialized = false;
Resources.HIGH_SCORE = 0;

Resources.PLAYER_INVENTORY = {
  wallet: true,
  gun: false,
  cash: 100,
  points: 0,
  drugs: 0,
  expense: null,
};
