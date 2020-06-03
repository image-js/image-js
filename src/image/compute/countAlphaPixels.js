/**
 * Returns the number of transparent pixels
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.alpha=1] - Value of the alpha value to count.
 * @return {number} Number of transparent pixels
 */
export default function countAlphaPixels(options = {}) {
  let { alpha = 1 } = options;
  this.checkProcessable('countAlphaPixels', {
    bitDepth: [8, 16],
    alpha: 1,
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
