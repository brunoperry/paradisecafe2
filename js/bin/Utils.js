class Utils {

    static getRandomItem(data) {
        return data[Math.floor(Math.random() * data.length)];
    }
    static getRandomTrueFalse() {
        return Utils.getRandomItem([
            true, false, false, true, false, true, true, false, true, false, false, true, false, true, false, true, true, false
        ])
    }

    static clearItemsFrom(data, target) {

        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const elem = data[i];
            if (elem.name.includes(target)) continue;
            arr.push(elem);
        }
        return arr;
    }

    static shuffle(arr) {
        arr.map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);
    };

    static transition(ctx, canvas, callback) {

        let blocksize = 32;
        let intervalID = null;
        const pixelate = () => {

            canvas.height = img.height;
            canvas.width = img.width;

            let size = blocksize / 100;
            let w = canvas.width * size;
            let h = canvas.height * size;

            ctx.msImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(img, 0, 0, w, h);
            ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);

            blocksize -= 4;

            if (blocksize <= 0) {
                callback();
                clearInterval(intervalID);
                intervalID = null;
            }
        }

        const img = document.querySelector('#transition-image');
        img.onload = () => {
            canvas.height = img.height / 4;
            canvas.width = img.width / 4;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            intervalID = setInterval(() => {
                pixelate();
            }, Game.CURRENT_SPEED);


        };
        img.src = canvas.toDataURL();

        return;
    }
}