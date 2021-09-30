window.onload = async () => {
    document.body.style.opacity = 1;

    initGame();
}

const initGame = async () => {

    const gameData = {
        tile: 'Paradise Café',
        media: {
            images: null,
            audios: null,
            font: null
        },
        labels: null,
        scores: null
    }

    let req = await fetch('https://brunoperry.net/games/paradisecafe/data')
    let res = await req.json();

    console.log(res)

    gameData.media.images = res.data.images;
    gameData.media.audios = res.data.audios;
    gameData.media.font = res.data.font;
    gameData.labels = res.data.labels;
    gameData.scores = res.scores;

    await new Game().init(gameData);
    console.log('brunoperry.net@2021');
}