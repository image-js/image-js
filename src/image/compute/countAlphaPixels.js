
// returns the number of transparent

/**
 * Returns the number of transparent pixels
 * @memberof Image
 * @instance
 * @param {number} [$1.alpha=1] - Value of the alpha value to count. By default 1.
 * @returns {number} Number of transparent pixel
 */

export default function countAlphaPixels({
    alpha = 1
    } = {}) {
    this.checkProcessable('countAlphaPixels', {
        bitDepth: [8, 16],
        alpha: 1
    });

    let count = 0;

    if (alpha !== undefined) {
        for (let i = this.components; i < this.data.length; i += this.channels) {
            if (this.data[i] === alpha) {
                count++;
            }
        }
        return count;
    } else {
        // because there is an alpha channel all the pixels have an alpha
        return this.size;
    }
}
