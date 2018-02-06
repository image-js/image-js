import { checkRow, checkChannel } from '../internal/checks';

/**
 * @memberof Image
 * @instance
 * @param {number} row
 * @param {number} [channel=0]
 * @return {number[]}
 */
export default function getRow(row, channel = 0) {
  this.checkProcessable('getRow', {
    bitDepth: [8, 16]
  });

  checkRow(this, row);
  checkChannel(this, channel);


  let array = new Array(this.width);
  let ptr = 0;
  let begin = row * this.width * this.channels + channel;
  let end = begin + this.width * this.channels;
  for (let j = begin; j < end; j += this.channels) {
    array[ptr++] = this.data[j];
  }

  return array;
}
