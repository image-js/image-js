/**
 * @memberof Stack
 * @instance
 * @param {object} [options]
 * @return {number[]}
 */
export default function histogram(options) {
  this.checkProcessable('min', {
    bitDepth: [8, 16],
  });

  let histogram = this[0].getHistogram(options);
  for (let i = 1; i < this.length; i++) {
    let secondHistogram = this[i].getHistogram(options);
    for (let j = 0; j < histogram.length; j++) {
      histogram[j] += secondHistogram[j];
    }
  }
  return histogram;
}
