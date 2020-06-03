/**
 * Returns the moment of an image (https://en.wikipedia.org/wiki/Image_moment)
 * @memberof Image
 * @instance
 * @param {number} [xPower=0]
 * @param {number} [yPower=0]
 * @return {number}
 */
export default function getMoment(xPower = 0, yPower = 0) {
  this.checkProcessable('getMoment', {
    bitDepth: [1],
  });

  let m = 0;

  for (let x = 0; x < this.width; x++) {
    for (let y = 0; y < this.height; y++) {
      if (this.getBitXY(x, y) === 1) {
        m += x ** xPower * y ** yPower;
      }
    }
  }
  return m;
}
