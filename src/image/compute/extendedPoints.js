/**
 * Allows to generate an array of points for a binary image (bit depth = 1)
 * The points consider the beginning and the end of each pixel
 * This method is only used to calculate minimalBoundRectangle
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>} - an array of [x,y] corresponding to the set pixels in the binary image
 */
export default function extendedPoints() {
  this.checkProcessable('extendedPoints', {
    bitDepth: [1],
  });

  const pixels = [];
  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      if (this.getBitXY(x, y) === 1) {
        pixels.push([x, y]);

        if (this.getBitXY(x + 1, y) !== 1) {
          pixels.push([x + 1, y]);
          pixels.push([x + 1, y + 1]);
          if (this.getBitXY(x, y + 1) !== 1) {
            pixels.push([x, y + 1]);
          }
        } else {
          if (this.getBitXY(x, y + 1) !== 1) {
            pixels.push([x, y + 1]);
            pixels.push([x + 1, y + 1]);
          }
        }

        // this small optimization allows to reduce dramatically the number of points for MBR calculation
        while (
          x < this.width - 2 &&
          this.getBitXY(x + 1, y) === 1 &&
          this.getBitXY(x + 2, y) === 1
        ) {
          x++;
        }
      }
    }
  }
  return pixels;
}
