import { checkColumn, checkChannel } from '../internal/checks';

/**
 * @memberof Image
 * @instance
 * @param {number} column
 * @param {number} [channel=0]
 * @return {number[]}
 */
export default function getColumn(column, channel = 0) {
  this.checkProcessable('getColumn', {
    bitDepth: [8, 16],
  });

  checkColumn(this, column);
  checkChannel(this, channel);

  let array = new Array(this.height);
  let ptr = 0;
  let step = this.width * this.channels;
  for (
    let j = channel + column * this.channels;
    j < this.data.length;
    j += step
  ) {
    array[ptr++] = this.data[j];
  }
  return array;
}
