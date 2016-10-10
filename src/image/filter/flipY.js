/**
 * Flip an image vertically. The image
 * @memberof Image
 * @instance
 * @param {object} options
 * @returns {this}
 */

export default function flipY(options = {}) {
	this.checkProcessable('flipY', {
		bitDepth: [1, 8, 16]
	});

	for (let x = this.width - 1; x >= 0; x--) {
		for (let aY = 0, bY = this.height - 1; aY <= bY; aY++, bY--) {
			let pixelA = this.getPixelXY(x, aY);
			let pixelB = this.getPixelXY(x, bY);
			this.setPixelXY(x, bY, pixelA);
			this.setPixelXY(x, aY, pixelB);
		}
	}

	return this;
}
