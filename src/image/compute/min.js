import newArray from 'new-array';

/**
 * Returns an array with the minimal value of each channel
 * @memberof Image
 * @instance
 * @return {number[]} Array having has size the number of channels
 */
export default function min() {
  this.checkProcessable('min', {
    bitDepth: [8, 16, 32],
  });

  let result = newArray(this.channels, +Infinity);

  for (let i = 0; i < this.data.length; i += this.channels) {
    for (let c = 0; c < this.channels; c++) {
      if (this.data[i + c] < result[c]) {
        result[c] = this.data[i + c];
      }
    }
  }
  return result;
}
