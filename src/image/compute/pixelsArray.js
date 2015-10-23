// this function will return an array containing an array of XY

export default function getPixelsArray() {
    this.checkProcessable('getPixelsArray', {
        bitDepth: [1]
    });

    if (this.bitDepth === 1) {
        let pixels = new Array(this.size);
        let counter = 0;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.getBitXY(x, y) === 1) {
                    pixels[counter++] = [x, y];
                }
            }
        }
        pixels.length = counter;
        return pixels;
    }
}

