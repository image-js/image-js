import newArray from 'new-array';

/**
 * Returns an array with the sum of the values of each channel
 * @memberof Image
 * @instance
 * @return {number[]} Array having has size the number of channels
 */
export default function sum() {
  this.checkProcessable('sum', {
    bitDepth: [8, 16],
  });

  let result = newArray(this.channels, 0);

  for (let i = 0; i < this.data.length; i += this.channels) {
    for (let c = 0; c < this.channels; c++) {
      result[c] += this.data[i + c];
    }
  }
  return result;
}
