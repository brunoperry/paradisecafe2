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
        const totalImages = images.length;
        for (let i = 0; i < totalImages; i++) {
          const image = images[i];
          const req = await fetch(image.path);
          const res = await req.blob();
          Loader.update({
            text: "loading images",
            value: i / totalImages,
          });
          image.imageData = await createImageBitmap(res);
        }
        Resources.imagesData = data.media.images.children;

        const audios = data.media.audios.children;
        const totalAudios = audios.length;
        for (let i = 0; i < totalAudios; i++) {
          const audio = audios[i];
          const req = await fetch(audio.path);
          const res = await req.blob();

          Loader.update({
            text: "loading Audios",
            value: i / totalAudios,
          });
          audio.audioData = window.URL.createObjectURL(res);
        }
        Resources.audioData = data.media.audios.children;

        Resources.initialized = true;
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(new Error("Error loading images!"));
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
