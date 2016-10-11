/**
 * Flip an image horizontally. The image
 * @memberof Image
 * @instance
 * @returns {this}
 */

export default function flipX() {
    this.checkProcessable('flipX', {
        bitDepth: [1, 8, 16]
    });

    for (let y = this.height - 1; y >= 0; y--) {
        for (let aX = 0, bX = this.width - 1; aX <= bX; aX++, bX--) {
            let pixelA = this.getPixelXY(aX, y);
            let pixelB = this.getPixelXY(bX, y);
            this.setPixelXY(bX, y, pixelA);
            this.setPixelXY(aX, y, pixelB);
        }
    }

    return this;
}
