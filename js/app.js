window.onload = async () => {
  document.body.style.opacity = 1;

  initGame();
};

const initGame = async () => {
  const gameData = {
    tile: "Paradise Café",
    media: {
      images: null,
      audios: null,
      font: null,
    },
    labels: null,
    scores: null,
  };

  // let req = await fetch('https://brunoperry.net/games/paradisecafe/data')
  let req = await fetch("./data.json");
  let res = await req.json();

  gameData.media.images = res.images;
  gameData.media.audios = res.audios;
  gameData.media.font = res.font;
  gameData.labels = res.labels;
  gameData.scores = res.scores;
  //   console.log(res);

  await new Game().init(gameData);
  //   console.log("brunoperry.net@2021");
};
