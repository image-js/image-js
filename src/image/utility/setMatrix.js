import { Matrix } from 'ml-matrix';

/**
 * We set the data of the image from a matrix. The size of the matrix and the data have to be the same.
 * @memberof Image
 * @instance
 * @param {Matrix} matrix
 * @param {object} [options]
 * @param {number} [options.channel]
 */
export default function setMatrix(matrix, options = {}) {
  matrix = new Matrix(matrix);
  let { channel } = options;
  this.checkProcessable('getMatrix', {
    bitDepth: [8, 16],
  });

  if (channel === undefined) {
    if (this.components > 1) {
      throw new RangeError(
        'You need to define the channel for an image that contains more than one channel',
      );
    }
    channel = 0;
  }

  if (this.width !== matrix.columns || this.height !== matrix.rows) {
    throw new RangeError(
      'The size of the matrix must be equal to the size of the image',
    );
  }

  for (let x = 0; x < this.height; x++) {
    for (let y = 0; y < this.width; y++) {
      this.setValueXY(y, x, channel, matrix.get(x, y));
    }
  }
}
