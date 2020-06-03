/**
 * Allows to generate an array of points for a binary image (bit depth = 1)
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>} - an array of [x,y] corresponding to the set pixels in the binary image
 */
export default function points() {
  this.checkProcessable('points', {
    bitDepth: [1],
  });

  const pixels = [];
  for (let x = 0; x < this.width; x++) {
    for (let y = 0; y < this.height; y++) {
      if (this.getBitXY(x, y) === 1) {
        pixels.push([x, y]);
      }
    }
  }
  return pixels;
}
